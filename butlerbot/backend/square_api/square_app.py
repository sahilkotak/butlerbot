import os
import uuid
import logging
from fastapi.responses import FileResponse, RedirectResponse

from .oauth_client import conduct_authorize_url

logging.basicConfig(level=logging.INFO)

async def authorise():
    '''The endpoint that renders the link to Square authorization page.'''

    # set the Auth_State cookie with a random uuid string to protect against cross-site request forgery
    # Auth_State will expire in 60 seconds once the page is loaded, you can customize the timeout based 
    # on your scenario.
    # `HttpOnly` helps mitigate XSS risks and `SameSite` helps mitigate CSRF risks. 
    
    state = str(uuid.uuid4())
    #cookie_str = 'OAuthState={0}; HttpOnly; Max-Age=60; SameSite=Lax'.format(state)

    # create the authorize url with the state
    authorize_url = conduct_authorize_url(state)
    return RedirectResponse(url=authorize_url)

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

