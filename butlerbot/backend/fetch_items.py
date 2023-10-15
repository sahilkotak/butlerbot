import boto3
from boto3.dynamodb.conditions import Key
import json
from decimal import Decimal

def fetch_items():
    AWS_ACCESS_KEY_ID="key" #refactor this
    AWS_SECRET_ACCESS_KEY="key" #refactor this
    dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
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
        }
        items_details.append(item_details)

    # Currency code is stored in the 'currency' field in the DynamoDB table
    currency_code = response['Items'][0]['currency']

    # Format the items and currency code into a json
    # The json will be in the format: {"items": [{"item_description": "", "item_name": "", "price": "", "variation_name": ""}, ...], "currency": ""}
    items_json = json.dumps({"items": items_details, "currency": currency_code, "message": "This our menu, only allow users to order what's available here."})

    return items_json
