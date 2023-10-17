import os
import uuid
import logging
import json
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

async def getItems(checkout_params):
    merchant = Merchant()
    data = merchant.get_menu(query_params=checkout_params)

    return JSONResponse(content=data, status_code=200)


async def create_checkout(checkout_params):
    """
    Create a checkout and return the payment link.

    Args:
        checkout_params (dict): Dictionary containing 'access_token' and 'data'.

    Returns:
        JSONResponse: Response containing payment link or error message.
    """
    access_token = checkout_params.get('access_token')
    device_id = checkout_params.get('device_id')
    data = checkout_params.get('data')

    if None in [access_token, device_id,  data]:
        raise HTTPException(status_code=400, detail="Missing Required Parameters!")

    try:
       
        client = Client(
            access_token=access_token.split(" ")[1],
            environment=environment
        )

        checkout = client.terminal.create_terminal_checkout(
            body = {
                "idempotency_key": str(uuid.uuid4()),
                "checkout": {
                    "device_options": {
                        "device_id": device_id
                    },
                    "amount_money": {
                        "amount": 20,
                        "currency": "GBP"
                    },
                }
            }
        )
        logging.info(checkout)
        if checkout.is_success():
            payment_link = checkout.body
            response_data = {"message": "Terminal checkout successful!", "response": payment_link}
            return JSONResponse(content=response_data, status_code=200)
        elif checkout.is_error():
            response_data = {"message": "Checkout unsuccessful!", "data": checkout.errors}
            return JSONResponse(content=response_data, status_code=400)
    except Exception as e:
        return JSONResponse(content={"error": f"Error: {str(e)}"}, status_code=500)

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
    client_url = os.environ.get("BUTLERBOT_CLIENT_URL", "/index.html")

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
                logging.info("Merchant record added/updated.")

                logging.info("fetching merchandise items")
                merchandise_details_response = square_client.catalog.list_catalog(
                    types = "ITEM"
                )
                
                merchandise_details = merchandise_details_response.body
                if merchandise_details and merchandise_details["objects"]:
                    merchandise_items = merchandise_details["objects"]
                    merchant_merchandise = merchant.add_merchandise(merchant_obj, merchandise_items)
                    # logging.info("Merchandise: " + json.dumps({ "items": merchant_merchandise }, indent=4))

                    device_details_response = square_client.devices.list_device_codes(location_id=merchant_location_id)
                    device_details = device_details_response.body
                    # if device_details and device_details["device_codes"]:
                    #     device_detail = device_details["device_codes"][0]
                    #     device_id = device_detail["id"]

                    response = RedirectResponse(
                        url=client_url,
                        status_code=302,
                        headers={
                            'Content-Type': 'text/html',
                        }
                    )
                    response.set_cookie(key="X-ButlerBot-Active-Session-Token", value=access_token, max_age=time_difference_seconds(expires_at))
                    response.set_cookie(key="X-ButlerBot-Merchant-Id", value=merchant_id, max_age=time_difference_seconds(expires_at))
                    response.set_cookie(key="X-ButlerBot-Merchant-Name", value=merchant_name, max_age=time_difference_seconds(expires_at))
                    response.set_cookie(key="X-ButlerBot-Merchant-Loc", value=merchant_location_id, max_age=time_difference_seconds(expires_at))
                    # response.set_cookie(key="X-ButlerBot-Merchant-Device-Id", value=device_id, max_age=time_difference_seconds(expires_at))
                    return response
                    # else:
                    #     return JSONResponse(content={"message": "Unfortunately no Terminal device data was found from your Square account. Please try again a different Square account or use our demo ButlerBot Square account."}, status_code=400)
                else:
                    return JSONResponse(content={"message": "Unfortunately no merchandise data was found from your Square account. Please try again a different Square account or use our demo ButlerBot Square account."}, status_code=400)
            except Exception as e:
                logging.info("Error: Test " + str(e))
                return JSONResponse(content={"error": "Internal Server Error: Unknown Error."}, status_code=500)

        elif response.is_error():
            return JSONResponse(content={"error": "Unauthorised: Authorisation failed."}, status_code=400)
    elif 'error' in query_params:
        return JSONResponse(content={"error": f"Unauthorised: {query_params.get('error_description')}."}, status_code=400)
    else:
        return JSONResponse(content={"error": "Unauthorised: Unknown error."}, status_code=400)