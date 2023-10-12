import os
import logging
import boto3
import attr
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr

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
        self.merchant_table = ddb.Table("merchant")
        self.merchandise_table = ddb.Table("merchandise")
    
    def get_merchant(self, query_params):
        access_token = query_params.get("access_token")
        merchant_id = query_params.get("merchant_id")
        
        if merchant_id: 
            try:
                response = self.merchant_table.get_item(Key={"id": merchant_id})
                return response["Item"]
            except ClientError as e:
                logging.info("Error: " + str(e))
                raise
        else: 
            try:
                response = self.merchant_table.scan(
                    FilterExpression=Attr("access_token").eq(access_token)
                )
                items = response.get('Items', [])
                if items:
                    item = items[0]
                    return item
                else:
                    return None
            except ClientError as e:
                logging.info("Error: " + str(e))
                raise
    
    def add_merchant(self, merchant_obj):
        try:
            # validation
            if not (merchant_obj["id"] and merchant_obj["business_name"] and merchant_obj["access_token"] and merchant_obj["refresh_token"] and merchant_obj["main_location_id"] and merchant_obj["expires_at"]):
                raise Exception("Error: Missing required information about merchant.")
            
            response = self.merchant_table.put_item(
                Item=merchant_obj
            )
            return response
        except ClientError as e:
            logging.info(
                "Error: Couldn't add merchant %s to table %s. Here's why: %s: %s",
                merchant_obj["business_name"], self.merchant_table.name,
                e.response["Error"]["Code"], e.response["Error"]["Message"]
            )
            raise
        except Exception as e:
            logging.info("Error: " + str(e))
            raise
    
    def __get_merchandise_items(self, merchant, merchandise_items):
        items = []

        for merch_item in merchandise_items:
            for merch_variant in merch_item["item_data"]["variations"]:
                item = dict(merchant_id = merchant["id"])
                item["item_name"] = merch_item["item_data"]["name"]
                item["item_description"] = merch_item["item_data"]["description"]
                
                item["merchandise_id"] = merch_variant["id"]
                item["variation_name"] = merch_variant["item_variation_data"]["name"]

                item_available_in_main_loc = merch_variant["present_at_all_locations"] == True or (len(list(filter(
                    lambda location_id : location_id == merchant["main_location_id"], merch_variant["present_at_location_ids"])
                )) > 0)

                if merch_item["is_deleted"] == False and merch_variant["is_deleted"] == False and item_available_in_main_loc and merch_variant["item_variation_data"]["pricing_type"] == "FIXED_PRICING" and merch_variant["item_variation_data"]["sellable"] == True:
                    item["price"] = merch_variant["item_variation_data"]["price_money"]["amount"]
                    item["currency"] = merch_variant["item_variation_data"]["price_money"]["currency"]
                    logging.info("Merch record ids: %s (PK) | %s (SK) | %s", item["merchant_id"], item["merchandise_id"], item["variation_name"])
                    
                    items.append(item)
        
        return items

    def add_merchandise(self, merchant, merchandise_items):
        """
        :param merchant: Seller account.
        :param merchandise_items: Seller account's merchandise to add/update.
        """
        try:
            merch_to_add = []

            with self.merchandise_table.batch_writer() as writer:
                merch_to_add = self.__get_merchandise_items(merchant=merchant, merchandise_items=merchandise_items)
                logging.info(merch_to_add)

                for merch in merch_to_add:
                    logging.info("Merch records ids: " + merch["merchant_id"] + " | " + merch["merchandise_id"])
                    writer.put_item(Item=merch)
                
            return merch_to_add
        except ClientError as err:
            logging.info(
                "Error: Couldn't add merchandise data into table %s. Here's why: %s: %s", self.merchandise_table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise