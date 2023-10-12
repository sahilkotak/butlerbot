import os
import uuid
import logging
from http import cookies
from datetime import datetime, timezone
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi import HTTPException

from square.client import Client
from .oauth_client import conduct_authorize_url, exchange_oauth_tokens
from .merchant import Merchant

logging.basicConfig(level=logging.INFO)

environment = os.environ.get("ENVIRONMENT", "sandbox")

def authorise():
    '''The endpoint that renders the link to Square authorization page.'''

    # set the Auth_State cookie with a random uuid string to protect against cross-site request forgery
    # Auth_State will expire in 60 seconds once the page is loaded, you can customize the timeout based 
    # on your scenario.
    # `HttpOnly` helps mitigate XSS risks and `SameSite` helps mitigate CSRF risks. 
    
    state = str(uuid.uuid4())
    cookie_str = 'O-Auth-State={0}; HttpOnly; Max-Age=60; SameSite=Lax'.format(state)

    # create the authorize url with the state
    authorise_url = conduct_authorize_url(state)
    return RedirectResponse(url=authorise_url, headers={
        'Content-Type': 'text/html',
        'Set-Cookie': cookie_str
    })

# async def create_checkout(access_token, data: dict, location: str):
async def create_checkout(checkout_params):
    
    access_token = checkout_params.get('access_token')
    data = checkout_params.get('data')

    if access_token is None:
        raise HTTPException(status_code=401, detail="Access token missing")
    try:
        client = Client(
                    access_token=access_token.split(" ")[1],
                    environment=environment,
                )
        
        query_params = {
            "access_token": access_token.split(" ")[1],
            "merchant_id": None
        }

        item = Merchant().get_merchant(query_params)
        locationId = item.get('main_location_id')

        line_items = data["data"]
        result = client.checkout.create_payment_link(
            body = {
                "idempotency_key": str(uuid.uuid4()),
                "order": {
                "location_id": locationId,
                "line_items": line_items
                }
            }
            )

        if result.is_success():
            payment_link = result.body["payment_link"]["long_url"]
            response_data = {"message": "Checkout successful!", "payment_link": payment_link}
        elif result.is_error():
            response_data = {"message": "Checkout successful!", "data": result.errors}
            logging.info(result.errors)
        return JSONResponse(content=response_data)
    except Exception:
        return JSONResponse(content={"error": "Unauthorised: Authorisation failed"}, status_code=400)

def time_difference_seconds(timestamp_iso):
    timestamp_datetime = datetime.fromisoformat(timestamp_iso)
    current_time = datetime.now(timezone.utc)

    time_difference = timestamp_datetime - current_time
    time_difference_seconds = time_difference.total_seconds()

    return int(time_difference_seconds)

async def authorize_callback(query_params, cookie):
    '''The endpoint that handles Square authorization callback.

    The endpoint receives authorization result from the Square authorization page.
    If it is a successful authorization, it will use the code to exchange an
    access_token and refresh_token and store them in db table.
    If it is a failed authorization, it collects the failure oauth_apin and render the response.

    This callback endpoint should be added as the OAuth Redirect URL of your Square application
    in the Square Developer Dashboard.

    Query Parameters
    ----------------
    response_type : str
    The type of the response, it should be 'code' with a succesful authorization callback.

    code : str
    A valid authorization code. Authorization codes are exchanged for OAuth access tokens with the ObtainToken endpoint.

    state : str
    The state that was set in the original authorization url. verify this value to help
    protect against cross-site request forgery.

    error : str
    The error code of a failed authrization. Only exists when failed to authorize.

    error_description : str
    The error description of a failed authrization. Only exists when failed to authorize.
    '''

    # get the state that was set in the authorization url
    state = query_params.get('state')
    client_url = os.environ.get("BUTLERBOT_CLIENT_URL", "http://localhost:5173")

    # get the auth state cookie to compare with the state that is in the callback
    cookie_state = ''
    if cookie:
        c = cookies.SimpleCookie(cookie)
        cookie_state = c['O-Auth-State'].value
    
    if cookie_state == '' or state != cookie_state:
        return JSONResponse(content={"error": "Unauthorised: Invalid request due to invalid auth state."}, status_code=400)
    elif 'code' == query_params.get('response_type'):
        response = exchange_oauth_tokens(code=query_params.get('code'))
        if response.is_success():
            body = response.body
            refresh_token = body['refresh_token']
            access_token = body['access_token']
            expires_at = body['expires_at']
            merchant_id = body['merchant_id']

            logging.info("Refresh Token: " + refresh_token)
            logging.info("Access Token: " + access_token)
            logging.info("Expires at: " + expires_at)

            try:
                square_client = Client(
                    access_token=access_token,
                    environment=environment,
                    user_agent_detail='butlerbot_app_python',
                    max_retries=2,
                    timeout=60
                )
                merchant_details_response = square_client.merchants.retrieve_merchant(
                    merchant_id = merchant_id
                )
                merchant_details = merchant_details_response.body
                merchant_name = merchant_details["merchant"]["business_name"]
                merchant_location_id = merchant_details["merchant"]["main_location_id"]

                merchant_obj = {
                    "id": merchant_id,
                    "business_name": merchant_name,
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "main_location_id": merchant_location_id,
                    "expires_at": expires_at,
                }
                merchant = Merchant()
                merchant.add_merchant(merchant_obj=merchant_obj)
                logging.info("New merchant record added.")

                cookie_str = 'X-ButlerBot-Active-Session-Token={0}; HttpOnly; Max-Age={1}; SameSite=Lax'.format(
                    access_token, 
                    time_difference_seconds(expires_at)
                )
                return RedirectResponse(
                    url='{0}/setup/{1}'.format(client_url, access_token), 
                    status_code=302,
                    headers={
                        'Content-Type': 'text/html',
                        'Set-Cookie': cookie_str
                    }
                )
            except Exception as e:
                logging.info("Error: " + str(e))
                return JSONResponse(content={"error": "Internal Server Error: Unknown Error."}, status_code=500)

        elif response.is_error():
            return JSONResponse(content={"error": "Unauthorised: Authorisation failed."}, status_code=400)
    elif 'error' in query_params:
        return JSONResponse(content={"error": f"Unauthorised: {query_params.get('error_description')}."}, status_code=400)
    else:
        return JSONResponse(content={"error": "Unauthorised: Unknown error."}, status_code=400)