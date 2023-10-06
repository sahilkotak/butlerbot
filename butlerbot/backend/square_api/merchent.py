import os
import boto3
from botocore.exceptions import ClientError

import logging

class Config:
    DB_REGION_NAME = os.getenv("DB_REGION_NAME", "ap-southeast-2")
    #DB_ACCESS_KEY_ID = os.getenv("DB_ACCESS_KEY_ID")
    #DB_SECRET_ACCESS_KEY = os.getenv("DB_SECRET_ACCESS_KEY")

class Merchent:
    def __init__(self):
        ddb = boto3.resource(
            'dynamodb',
            region_name=Config.DB_REGION_NAME,
            #aws_access_key_id=Config.DB_ACCESS_KEY_ID,
            #aws_secret_access_key=Config.DB_SECRET_ACCESS_KEY
        )
        table_name = 'merchent'
        self.table = ddb.Table(table_name)
    
    def get_merchent(self, merchent_id):
        try:
            response = self.table.get_item(Key={'item_id': "MLF15C4CDSG4S"})
            logging.info("Merchent record: ", response)
        except ClientError as e:
            return { "error": str(e) }
