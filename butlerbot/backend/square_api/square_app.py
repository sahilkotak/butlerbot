import os
import uuid
import logging
from http import cookies
from fastapi.responses import JSONResponse, RedirectResponse

from .oauth_client import conduct_authorize_url, exchange_oauth_tokens

logging.basicConfig(level=logging.INFO)

def authorise():
    '''The endpoint that renders the link to Square authorization page.'''

    # set the Auth_State cookie with a random uuid string to protect against cross-site request forgery
    # Auth_State will expire in 60 seconds once the page is loaded, you can customize the timeout based 
    # on your scenario.
    # `HttpOnly` helps mitigate XSS risks and `SameSite` helps mitigate CSRF risks. 
    
    state = str(uuid.uuid4())
    cookie_str = 'OAuthState={0}; HttpOnly; Max-Age=60; SameSite=Lax'.format(state)

    # create the authorize url with the state
    authorise_url = conduct_authorize_url(state)
    return RedirectResponse(url=authorise_url, headers={
        'Content-Type': 'text/html',
        'Set-Cookie': cookie_str
    })

def authorize_callback(query_params, cookie):
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
    client_success_url = os.environ.get("BUTLERBOT_CLIENT_URL", "http://localhost:5173/")

    # get the auth state cookie to compare with the state that is in the callback
    cookie_state = ''
    if cookie:
        c = cookies.SimpleCookie(cookie)
        cookie_state = c['OAuthState'].value
    
    if cookie_state == '' or state != cookie_state:
        return JSONResponse(content={"error": "Unauthorised: Invalid request due to invalid auth state."}, status_code=400)
    elif 'code' == query_params.get('response_type'):
        response = exchange_oauth_tokens(code=query_params.get('code'))
        if response.is_success():
            body = response.body
            refresh_token = body['refresh_token']
            access_token = body['access_token']
            expires_at = body['expires_at']
            merchent_id = body['merchant_id']
            
            logging.info("Refresh Token: " + refresh_token)
            logging.info("Access Token: " + access_token)
            # TODO: encrypt the refresh_token and access_token before saving to db
            return RedirectResponse(url=client_success_url, status_code=302)
        elif response.is_error():
            return JSONResponse(content={"error": "Unauthorised: Authorisation failed."}, status_code=400)
    elif 'error' in query_params:
        return JSONResponse(content={"error": f"Unauthorised: {query_params.get('error_description')}."}, status_code=400)
    else:
        return JSONResponse(content={"error": "Unauthorised: Unknown error."}, status_code=400)