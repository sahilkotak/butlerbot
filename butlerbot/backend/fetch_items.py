from locale import currency
import boto3
from boto3.dynamodb.conditions import Key
import json
from decimal import Decimal
import os

class Config:
    DB_REGION_NAME = os.getenv("DB_REGION_NAME", "ap-southeast-2")

def fetch_items(merchant_id=None):

    dynamodb = boto3.resource(
        "dynamodb",
    )
    table = dynamodb.Table('merchandise')

    # Fetch items for a specific merchant
    response = table.query(
        KeyConditionExpression=Key('merchant_id').eq(merchant_id)
    )

    items = response['Items']

    # Extract the required details from each item
    items_details = []
    for item in items:
        # Check if the necessary fields are present in the item
        if 'item_name' in item and 'price' in item and 'variation_name' in item:
            item_details = {
                'item_name': item['item_name'].title(),  # Convert item name to title case
                'price': str(Decimal(item['price'])),  # Convert Decimal to string to avoid JSON serialization error
                'variation_name': item['variation_name'],
            }
            items_details.append(item_details)
        
    # Currency code is stored in the 'currency' field in the DynamoDB table
    currency_code = response['Items'][0]['currency'] if 'currency' in response['Items'][0] else None

    # Format the items and currency code into a json
    # The json will be in the format: {"items": [{ "item_name": "", "price": "", "variation_name": ""}, ...], "currency": ""}
    items_json = json.dumps({"items": items_details, "currency": currency_code})

    return items_json

def fetch_item_description(item_name, merchant_id=None):

    dynamodb = boto3.resource(
        "dynamodb",
    )
    table = dynamodb.Table('merchandise')

    # Fetch items for a specific merchant
    response = table.query(
        KeyConditionExpression=Key('merchant_id').eq(merchant_id)
    )

    items = response['Items']

    # Filter items based on item_name
    items = [item for item in items if item['item_name'] == item_name]

    # Check if items exist
    if not items:
        return json.dumps({"items": []})

    # Extract the required details from the first item
    item = items[0]
    item_details = {
        'item_name': item['item_name'].title(),  # Convert item name to title case
        'item_description': item['item_description'],
    }

    # Format the item into a json
    # The json will be in the format: {"item": {"item_description": "", "item_name": ""}}
    item_json = json.dumps({"item": item_details})

    return item_json
