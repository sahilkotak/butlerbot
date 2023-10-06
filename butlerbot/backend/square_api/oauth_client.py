import os
import logging

from square.client import Client

logging.basicConfig(level=logging.INFO)

environment = os.environ.get("ENVIRONMENT", "sandbox")
access_token = os.environ.get("ACCESS_TOKEN", "EAAAEDcH-q3nGz9rFuNnHGsJDaDAJdz7_UYmbVUwmjmiDrL8Qhl4i6-ICqSQU84A")
client_id = os.environ.get("CLIENT_ID", "sandbox-sq0idb-vvZY6w8UoVogVaZ7FbUH9A")
client_secret = os.environ.get("CLIENT_SECRET", "sandbox-sq0csb-zjBrpXqJYoOtYTnuT5l4W_v7egv47BlhN9s8sPvFEfo")

# initialize square oauth client
square_client = Client(
    access_token=access_token,
    environment=environment,
    user_agent_detail='butlerbot_app_oauth_python',
    max_retries=2,
    timeout=60
)
oauth_api = square_client.o_auth


def conduct_authorize_url(state):
    '''Conduct a Square authorization url 

    This method creates a Square authroization url that takes client to Square
    authorization page to finish OAuth permission grant process.

    This url contains several important query parameters:

    client_id - aka. application id, the Square application which is requesting permissions.

    scope - s space-separated list of the permissions the application is requesting, different square api require different permissions.

    session - Suggest to set it to `false` all the time in production, only set it to `true` in sandbox

    state - we should set state value and verify the value in the callback to help protect against cross-site request forgery.

    Parameters
    ----------
    state : str
        The state value that will be verified in the authorizae callback.
    '''
    base_url = os.environ.get("BASE_URL", "https://connect.squareupsandbox.com")
    permissions = os.environ.get("PERMISSIONS", "ITEMS_READ PAYMENTS_WRITE MERCHANT_PROFILE_READ ORDERS_WRITE ORDERS_READ PAYMENTS_WRITE CUSTOMERS_WRITE CUSTOMERS_READ PAYMENTS_WRITE PAYMENTS_READ PAYMENTS_WRITE PAYMENTS_READ")

    authorize_url = (
        base_url + '/oauth2/authorize'
        '?client_id=' + client_id +
        '&scope=' + permissions +
        '&session=' + str(environment == 'sandbox2') +
        '&state=' + state
    )
    return authorize_url


def exchange_oauth_tokens(code):
    '''Exchange Square OAuth tokens with authorization code 

    This method exchanges two OAuth tokens (Access Token and Refresh Token) with
    the authorization code that is returned with the authorize callback.

    We call `obtain_token` api with authorization code to get OAuth tokens.

    Parameters
    ----------
    code : str
        The authorization code to exchange OAuth tokens.
    '''
    request_body = {}
    request_body['client_id'] = client_id
    request_body['client_secret'] = client_secret
    request_body['code'] = code
    request_body['grant_type'] = 'authorization_code'
    response = oauth_api.obtain_token(request_body)
    return response


def refresh_oauth_access_token(refresh_token):
    '''Refresh Square OAuth access token with refresh token 

    This method calls `obtain_token` api with the refresh token that was retrieved from `exchangeOAuthToken`.

    Parameters
    ----------
    refresh_token : str
        A valid refresh token for generating a new OAuth access token.
    '''
    request_body = {}
    request_body['client_id'] = client_id
    request_body['client_secret'] = client_secret
    # Set the refresh_token
    request_body['refresh_token'] = refresh_token
    request_body['grant_type'] = 'refresh_token'
    response = oauth_api.obtain_token(request_body)
    return response


def revoke_oauth_access_token(merchant_id):
    '''Revoke All Square OAuth tokens from a merchant

    This method calls `revoke_token` api with id of the merchant whose token you want to revoke.

    Parameters
    ----------
    merchant_id : str
        The id of the merchant whose token you want to revoke.
    '''
    request_body = {}
    request_body['client_id'] = client_id
    request_body['merchant_id'] = merchant_id
    # The authentication need a special prefix 'Client ' before appending client secret
    response = oauth_api.revoke_token(request_body, 'Client ' + client_secret)
    return response


# async def authorise_client(authorization: str = Query(default=None)):
#     scope = os.environ.get("SCOPE", "ITEMS_READ PAYMENTS_WRITE MERCHANT_PROFILE_READ ORDERS_WRITE ORDERS_READ PAYMENTS_WRITE CUSTOMERS_WRITE CUSTOMERS_READ PAYMENTS_WRITE PAYMENTS_READ PAYMENTS_WRITE PAYMENTS_READ")
#     redirect_uri = os.environ.get("REDIRECT_URL", "http://localhost:5173/")
#     state = str(uuid.uuid4())

#     result = client.o_auth.authorize(
#         client_id = client_id,
#         scope = scope,
#         locale = "en-US",
#         session = False,
#         state = state,
#         redirect_uri = redirect_uri
#     )

#     if result.is_success():
#         logging.info(result.body)
#     elif result.is_error():
#         logging.info(result.errors)

# @app.get("/products/")
# async def list_catalog_items(user_id: str):
#     access_token = access_tokens.get(user_id)

#     if access_token is None:
#         error_response = {"error": "Unauthorized"}
#         return JSONResponse(content=error_response, status_code=400)
#     try:
#         catalog_items = get_catalog_items(access_token)
#         return {"catalog_items": catalog_items}
#     except Exception as e:
#         error_response = {"error": str(e)}
#         return JSONResponse(content=error_response, status_code=500)
    
# @app.post("/payment")
# async def create_payment_api(user_id: str):
#     access_token = access_tokens.get(user_id)
#     if access_token is None:
#         error_response = {"error": "Unauthorized"}
#         return JSONResponse(content=error_response, status_code=400)
    
#     try:

#         payment_link = create_payment_link(access_token)
#         return {"catalog_items": payment_link}
#     except Exception as e:
#         return {"error": str(e)}

# @app.post("/create-customer")
# async def authorize_and_create_customer(user_id: str):
#     access_token = access_tokens.get(user_id)

#     if access_token is None:
#         error_response = {"error": "Unauthorized"}
#         return JSONResponse(content=error_response, status_code=400)
    
#     try:
#         customer_id = create_square_customer(access_token)
#         return {"message": "Customer created successfully.", "customer_id": customer_id}
#     except Exception as e:
#         return {"error": str(e)}

