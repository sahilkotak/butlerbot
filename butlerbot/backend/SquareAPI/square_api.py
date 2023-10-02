import requests
import uuid
import os
import webbrowser
from dotenv import load_dotenv
load_dotenv()
from .helper_function import create_payment_link, create_square_customer, get_catalog_items
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import  JSONResponse

app = FastAPI()

# Store access tokens in memory (store in the database for security purpose)
access_tokens = {}
client_id = os.environ.get("client_id")
client_secret = os.environ.get("client_secret")
redirect_uri = os.environ.get("REDIRECT_URL")
API_VERSION = os.environ.get("API_VERSION")
BASE_URL=os.environ.get("BASE_URL")
scope=os.environ.get("scope")


@app.get("/authorization-url/")
async def getAuthorization():
    authorizationUrl = f"https://connect.squareupsandbox.com/oauth2/authorize?client_id={client_id}&scope={scope}&redirect_uri={redirect_uri}&response_type=code"
    return {"authorizationUrl": authorizationUrl}

@app.post("/authorization/")
async def getAuthorization(authorization: str = Query(default=None)):
    
    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": authorization,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
    }

    headers = {
        "Square-Version": API_VERSION,
        "Content-Type": "application/json"
    }
   
    print(f"{BASE_URL}oauth2/token")
    # Make the POST request
    response = requests.post(f"{BASE_URL}oauth2/token", json=payload, headers=headers)
   
    if response.status_code == 200:
        user_id = str(uuid.uuid4())  # Generate a unique user ID
        access_token = response.json().get("access_token")
        access_tokens[user_id] = access_token
        print("Access Token:", access_token)
        return {"user_id": user_id}
    else:
        error_response = response.json() if response.headers.get('content-type') == 'application/json' else response.text
        raise HTTPException(status_code=response.status_code, detail=error_response)


@app.get("/products/")
async def list_catalog_items(user_id: str):

    access_token = access_tokens.get(user_id)

    if access_token is None:
        error_response = {"error": "Unauthorized"}
        return JSONResponse(content=error_response, status_code=400)
    try:
        catalog_items = get_catalog_items(access_token)
        return {"catalog_items": catalog_items}
    except Exception as e:
        error_response = {"error": str(e)}
        return JSONResponse(content=error_response, status_code=500)
    
@app.post("/checkout/")
async def create_checkout_link(user_id: str):
    access_token = access_tokens.get(user_id)
    if access_token is None:
        error_response = {"error": "Unauthorized"}
        return JSONResponse(content=error_response, status_code=400)
    try:

        payment_link = create_payment_link(access_token)
        return {"payment_link": payment_link}
    except Exception as e:
        return {"error": str(e)}

@app.post("/create-customer")
async def authorize_and_create_customer(user_id: str):
    access_token = access_tokens.get(user_id)

    if access_token is None:
        error_response = {"error": "Unauthorized"}
        return JSONResponse(content=error_response, status_code=400)
    
    try:
        customer_id = create_square_customer(access_token)
        return {"message": "Customer created successfully.", "customer_id": customer_id}
    except Exception as e:
        return {"error": str(e)}

