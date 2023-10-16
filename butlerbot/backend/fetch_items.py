from locale import currency
import boto3
from boto3.dynamodb.conditions import Key
import json
from decimal import Decimal
import os

class Config:
    DB_REGION_NAME = os.getenv("DB_REGION_NAME", "ap-southeast-2")
    #DB_ACCESS_KEY_ID = os.getenv("DB_ACCESS_KEY_ID")
    #DB_SECRET_ACCESS_KEY = os.getenv("DB_SECRET_ACCESS_KEY")

def fetch_items():
    dynamodb = boto3.resource(
        "dynamodb",
        #region_name=Config.DB_REGION_NAME,
        #aws_access_key_id=Config.DB_ACCESS_KEY_ID,
        #aws_secret_access_key=Config.DB_SECRET_ACCESS_KEY
    )
    table = dynamodb.Table('merchandise')

    # Fetch items for a specific merchant
    response = table.query(
        KeyConditionExpression=Key('merchant_id').eq('MLF15C4CDSG4S')
    )

    items = response['Items']

    # Extract the required details from each item
    items_details = []
    for item in items:
        item_details = {
            'item_description': item['item_description'],
            'item_name': item['item_name'].title(),  # Convert item name to title case
            'price': str(Decimal(item['price'])),  # Convert Decimal to string to avoid JSON serialization error
            'variation_name': item['variation_name'],
            'currency': response['Items'][0]['currency'],
        }
        items_details.append(item_details)

    # Currency code is stored in the 'currency' field in the DynamoDB table
    currency_code = response['Items'][0]['currency']

    # Format the items and currency code into a json
    # The json will be in the format: {"items": [{"item_description": "", "item_name": "", "price": "", "variation_name": ""}, ...], "currency": ""}
    items_json = json.dumps({"items": items_details, "currency": currency_code, "message": "This our menu, only allow users to order what's available here."})

    return items_json
