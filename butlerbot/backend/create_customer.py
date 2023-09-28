import requests
import json
import webbrowser

def get_authorization_code(client_id, redirect_uri, scope):
    authorization_url = f"https://connect.squareup.com/oauth2/authorize?client_id={client_id}&scope={scope}&redirect_uri={redirect_uri}&response_type=code"
    
    # Open the authorization URL in a web browser
    webbrowser.open(authorization_url)

    # Wait for the user to complete authorization and receive the authorization code manually
    authorization_code = input("Enter the authorization code from the redirected URL: ")

    return authorization_code

def create_square_customer(authorization_code):
    token_url = "https://connect.squareup.com/oauth2/token"

    token_data = {
        "client_id": "sq0idp-6aYBSQ_b6TCjM0iJ2viLFw",
        "client_secret": "sq0csp-CusXW-fZIE25jo29D-GjUNa6dwPOZ02NiIjLKltrjbQ",
        "code": authorization_code,
        # "redirect_uri": "http://localhost:8000/test",
        "redirect_uri": "https://ntibnportal.powerappsportals.com/",
        "grant_type": "authorization_code",
    }

    try:
        print("stated")
        response = requests.post(token_url, data=token_data)
        response.raise_for_status()
        access_token = response.json()["access_token"]
        print(f"Access Token: {access_token}")

        # Create a customer using the obtained access token
        create_customer_url = 'https://connect.squareup.com/v2/customers'

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
