import requests
import os
from dotenv import load_dotenv
load_dotenv()
import uuid
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)  # Set the desired logging level (INFO, DEBUG, ERROR, etc.)
logger = logging.getLogger(__name__)

BASE_URL=os.environ.get("BASE_URL")

def get_catalog_items(access_token):
    catalog_url = f"{BASE_URL}v2/catalog/list"

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
    
# create payment link helper function
def create_payment_link(access_token):
    checkout_api_url = f"{BASE_URL}v2/online-checkout/payment-links"
    list_locations_url = f"{BASE_URL}v2/locations"

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
        'Square-Version': os.environ.get("API_VERSION")
    }

    payment_link_data = {
        "checkout_options": {
            "allow_tipping": False,
            "ask_for_shipping_address": True,
            "accepted_payment_methods": {
                "afterpay_clearpay": True,
                "apple_pay": True,
                "cash_app_pay": True,
                "google_pay": True
            },
            "enable_coupon": False,
            "enable_loyalty": False,
            "merchant_support_email": "test@test.com",
            "redirect_url": os.environ.get("REDIRECT_URL")
        },
        "description": "No description for now!",
        "idempotency_key": str(uuid.uuid4()),
        "quick_pay": {
            "location_id": "",  # Will be replaced after obtaining the location response
            "name": "Ramesh",
            "price_money": {
                "amount": 1250,
                "currency": "USD"
            }
        }
    }

    try:
        locations_response = requests.get(list_locations_url, headers=headers)
        locations_response.raise_for_status()  # Raise an HTTPError for bad requests (4xx and 5xx responses)
        location_response = locations_response.json().get('locations')

        if location_response:
            location_id = location_response[0]['id']
            payment_link_data['quick_pay']['location_id'] = location_id

            response = requests.post(checkout_api_url, json=payment_link_data, headers=headers)
            response.raise_for_status()  # Raise an HTTPError for bad requests (4xx and 5xx responses)

            response_data = response.json()
            checkout_url = response_data.get('payment_link', {}).get('long_url')

            if checkout_url:
                print("Payment link created successfully!")
                return {
                    "location": location_response[0], 
                    "payment_info": response_data,  
                    "checkout_url": checkout_url
                }
            else:
                print("Failed to create payment link.")
                print(response_data)
        else:
            print("No locations found in the response.")

    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
    except Exception as e:
        print("Error occurred while creating payment link.")
        print(e)

# create square customer link
def create_square_customer(access_token):
    try:
        create_customer_url = "{BASE_URL}v2/customers"

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
            'Square-Version': '2023-09-25'
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