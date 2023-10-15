import base64
import json
import logging
import os
import time

import openai

from typing import Dict
from fetch_items import fetch_items

AI_COMPLETION_MODEL = os.getenv("AI_COMPLETION_MODEL", "gpt-3.5-turbo-0613")
LANGUAGE = os.getenv("LANGUAGE", "en")
INITIAL_PROMPT = f"You are ButlerBot - a helpful drive through assistant with a voice interface. Greet, take orders, confirm with price, share promotions, ask for additions, inform wait time, and guide to next window. Keep your responses very succinct and limited to a single sentence since the user is interacting with you through a voice interface. Available Menu Items: {fetch_items()}"

def add_to_cart(item_name: str, price: float) -> Dict:
    print(f"add_to_cart function was called with item_name: {item_name} and price: {price}")
    return {"message": "Added to cart succesfully!"}

def checkout() -> Dict:
    print("checkout function was called")
    return {"message": "Checkout initiated"}

async def get_completion(user_prompt, conversation_thus_far):
    if _is_empty(user_prompt):
        raise ValueError("empty user prompt received")

    start_time = time.time()
    messages = [
        {
            "role": "system",
            "content": INITIAL_PROMPT
        }
    ]

    messages.extend(json.loads(base64.b64decode(conversation_thus_far)))
    messages.append({"role": "user", "content": user_prompt})

    # Define the functions that the model can call
    functions = [
        {
            "name": "fetch_items",
            "description": "Fetch the items from DynamoDB",
            "parameters": {"type": "object", "properties": {}},
        },
        {
            "name": "add_to_cart",
            "description": "Add an item to the cart",
            "parameters": {
                "type": "object",
                "properties": {
                    "item_name": {"type": "string"},
                    "price": {"type": "number"},
                },
                "required": ["item_name", "price"],
            },
        },
        {
            "name": "checkout",
            "description": "Initiate the checkout procedure",
            "parameters": {"type": "object", "properties": {}},
        },
    ]

    logging.debug("calling %s", AI_COMPLETION_MODEL)
    res = await openai.ChatCompletion.acreate(model=AI_COMPLETION_MODEL, messages=messages, functions=functions, function_call="auto", timeout=15)
    logging.info("response received from %s %s %s %s", AI_COMPLETION_MODEL, "in", time.time() - start_time, "seconds")
    # Print the complete response from GPT
    print(f"GPT response: {res}")

    # Check if the model wants to call a function
    if 'function_call' in res['choices'][0]['message']:
        function_name = res['choices'][0]['message']['function_call']['name']
        function_args_str = res['choices'][0]['message']['function_call'].get('arguments', "{}")
        
        # Parse the arguments string into a Python dictionary
        function_args = json.loads(function_args_str)
        
        # Call the function and get the response
        if function_name == 'fetch_items':
            function_response = fetch_items()
        elif function_name == 'add_to_cart':
            function_response = add_to_cart(**function_args)
        elif function_name == 'checkout':
            function_response = checkout()
        else:
            raise ValueError(f"Unknown function: {function_name}")
        
        # Print the function call details
        print(f"Function called: {function_name}")
        print(f"Function arguments: {function_args}")
        print(f"Function response: {function_response}")
        
        # Call the model again by appending the function response as a new message
        messages.append({
            "role": "function",
            "name": function_name,
            "content": json.dumps(function_response)
        })
        res = await openai.ChatCompletion.acreate(model=AI_COMPLETION_MODEL, messages=messages, functions=functions, function_call="auto", timeout=15)

    # The model generates a user-facing message based on the function's response
    completion = res['choices'][0]['message']['content']
    logging.info('%s %s %s', AI_COMPLETION_MODEL, "response:", completion)

    return completion


def _is_empty(user_prompt: str):
    return not user_prompt or user_prompt.isspace()
