import requests
import uuid
import os
from dotenv import load_dotenv
import logging

import boto3
# from .helper_function import create_payment_link, create_square_customer, get_catalog_items
from square.client import Client

from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import  JSONResponse

load_dotenv()
app = FastAPI()

# Store access tokens in memory (store in the database for security purpose)
# access_tokens = {}

async def authorise_client(authorization: str = Query(default=None)):
    client_id = os.environ.get("CLIENT_ID", "sandbox-sq0idb-vvZY6w8UoVogVaZ7FbUH9A")
    scope = os.environ.get("SCOPE", "ITEMS_READ PAYMENTS_WRITE MERCHANT_PROFILE_READ ORDERS_WRITE ORDERS_READ PAYMENTS_WRITE CUSTOMERS_WRITE CUSTOMERS_READ PAYMENTS_WRITE PAYMENTS_READ PAYMENTS_WRITE PAYMENTS_READ")
    client_secret = os.environ.get("CLIENT_SECRET", "sandbox-sq0csb-zjBrpXqJYoOtYTnuT5l4W_v7egv47BlhN9s8sPvFEfo")
    redirect_uri = os.environ.get("REDIRECT_URL", "http://localhost:5173/")
    state = str(uuid.uuid4())

    result = client.o_auth.authorize(
        client_id = client_id,
        scope = scope,
        locale = "en-US",
        session = False,
        state = state,
        redirect_uri = redirect_uri
    )

    if result.is_success():
        logging.info(result.body)
    elif result.is_error():
        logging.info(result.errors)

    # payload = {
    #     "client_id": client_id,
    #     "client_secret": client_secret,
    #     "code": authorization,
    #     "grant_type": "authorization_code",
    #     "redirect_uri": redirect_uri,
    # }

    # headers = {
    #     "Square-Version": api_version,
    #     "Content-Type": "application/json"
    # }

    # # Make the POST request
    # response = requests.post(os.environ.get("AUTH_URL", "https://connect.squareupsandbox.com/oauth2/token"), json=payload, headers=headers)

    # if response.status_code == 200:
    #     user_id = str(uuid.uuid4())  # Generate a unique user ID
    #     access_token = response.json().get("access_token")
    #     access_tokens[user_id] = access_token
    #     logging.info(f"access token for user ({user_id}): {access_token}")
    #     return {"user_id": user_id}
    # else:
    #     error_response = response.json() if response.headers.get('content-type') == 'application/json' else response.text
    #     raise HTTPException(status_code=response.status_code, detail=error_response)


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

