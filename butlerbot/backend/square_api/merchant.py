import os
import logging
import boto3
from botocore.exceptions import ClientError


logging.basicConfig(level=logging.INFO)

class Config:
    DB_REGION_NAME = os.getenv("DB_REGION_NAME", "ap-southeast-2")
    DB_ACCESS_KEY_ID = os.getenv("DB_ACCESS_KEY_ID")
    DB_SECRET_ACCESS_KEY = os.getenv("DB_SECRET_ACCESS_KEY")

class Merchant:
    def __init__(self):
        ddb = boto3.resource(
            "dynamodb",
            region_name=Config.DB_REGION_NAME,
            aws_access_key_id=Config.DB_ACCESS_KEY_ID,
            aws_secret_access_key=Config.DB_SECRET_ACCESS_KEY
        )
        table_name = "merchant"
        self.table = ddb.Table(table_name)
    
    def get_merchant(self, merchant_id):
        try:
            response = self.table.get_item(Key={"id": merchant_id})
            return response["Item"]
        except ClientError as e:
            logging.info("Error: " + str(e))
            raise
    
    def add_merchant(self, merchant_obj):
        try:
            # validation
            if not (merchant_obj["id"] and merchant_obj["business_name"] and merchant_obj["access_token"] and merchant_obj["refresh_token"] and merchant_obj["main_location_id"] and merchant_obj["expires_at"]):
                raise Exception("Error: Missing required information about merchant.")
           
            response = self.table.put_item(
                Item=merchant_obj
            )
            return response
        except ClientError as e:
            logging.info(
                "Error: Couldn't add merchant %s to table %s. Here's why: %s: %s",
                merchant_obj["business_name"], self.table.name,
                e.response["Error"]["Code"], e.response["Error"]["Message"]
            )
            raise
        except Exception as e:
            logging.info("Error: " + str(e))
            raise