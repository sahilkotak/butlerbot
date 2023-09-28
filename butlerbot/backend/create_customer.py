# create_customer.py
import requests
import json

def create_square_customer(access_token, customer_data):
    create_customer_url = 'https://connect.squareup.com/v2/customers'

    headers = {
        'Authorization': 'Bearer EAAAEIQBQf7_4FQj3x63wAB_3ZkLFCRMuSNLthpcMADFzgKzHBPxl2dZNMCVzCdZ',
        'Content-Type': 'application/json',
        'Square-Version': '2023-08-16'
    }

    try:
        print( "Customer creation started")
        print(customer_data)
        print(access_token)
        response = requests.post(create_customer_url, headers=headers, data=json.dumps(customer_data))
        response.raise_for_status()

        customer_info = response.json()
        customer_id = customer_info['customer']['id']
        return customer_info

    except requests.exceptions.RequestException as e:
        print(f"Error creating customer: {e}")
        return None
