import requests
import os
from dotenv import load_dotenv
load_dotenv()

def get_catalog_items(access_token):
    catalog_url = "https://connect.squareupsandbox.com/v2/catalog/list"

    try:
         # Headers for API requests
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }

        catalog_response = requests.get(catalog_url, headers=headers)
        catalog_response.raise_for_status()
        catalog_data = catalog_response.json()

        # Extract and return the list of catalog items
        catalog_items = catalog_data.get("objects", [])
        
        return catalog_items
    except Exception as e:
        raise Exception(f"Error fetching catalog items: {e}")
    

# create square customer link
def create_square_customer(access_token):
    try:
        create_customer_url = 'https://connect.squareupsandbox.com/v2/customers'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
            'Square-Version': '2023-08-16'
        }
        customer_data = {
            "given_name": "Ramesh",
            "family_name": "Aryal",
            "email_address": "ramesh.aryal@socoro.com.au",
        }
        response = requests.post(create_customer_url, headers=headers, data=json.dumps(customer_data))
        response.raise_for_status()

        customer_info = response.json()
        customer_id = customer_info['customer']['id']
        return customer_id  # You may return other relevant information if needed
    except Exception as e:
        raise Exception(f"Error creating customer: {e}")
    

# create payment link helper function
def create_payment_link(authorization_code):
    token_url = "https://connect.squareupsandbox.com/oauth2/token"

    token_data = {
        "client_id": os.environ.get("client_id"),
        "client_secret": os.environ.get("client_secret"),
        "code": authorization_code,
        "redirect_uri": os.environ.get("REDIRECT_URL"),
        "grant_type": "authorization_code",
    }

    list_locations_url = "https://connect.squareupsandbox.com/v2/locations"
    
    try:

        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        access_token = token_response.json()["access_token"]
        print(f"Access Token: {access_token}")

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }

        response = requests.get(list_locations_url, headers=headers)
        response.raise_for_status()

        locations = response.json()["locations"]
        location_id = locations[0]['id']

        create_payment_url = f"https://connect.squareupsandbox.com/2023-08-16/locations/{location_id}/checkout/create"

        amount = 1000  
        currency = "USD"

        payment_request = {
            "amount_money": {
                "amount": amount,
                "currency": currency
            },
            "redirect_url": "https://yourwebsite.com/success",  # Replace with your redirect URL
            "order_id": "order123",  # Replace with your order ID
            "ask_for_shipping_address": False  # Set to True if you need shipping information
        }

        response = requests.post(create_payment_url, json=payment_request, headers=headers)
        response.raise_for_status()

        # Parse the response to get the payment link
        payment_link = response.json()["checkout"]["checkout_page_url"]
        print(f"Payment Link: {payment_link}")

        return payment_link
    except Exception as e:
        raise Exception(f"Error fetching catalog items: {e}")