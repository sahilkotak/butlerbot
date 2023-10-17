import base64
import json
import logging
import os
import time

import openai
from typing import Dict, List, Union

from fetch_items import fetch_items, fetch_item_description

AI_COMPLETION_MODEL = os.getenv("AI_COMPLETION_MODEL", "gpt-3.5-turbo-0613")
LANGUAGE = os.getenv("LANGUAGE", "en")

def add_to_cart(machine_instructions: List[Dict], items: List[Dict[str, Union[str, float, int]]]) -> Dict:
    print(f"add_to_cart function was called with items: {items}")
    for item in items:
        item_name = item.get('item_name')
        price = item.get('price')
        quantity = item.get('quantity')
        machine_instructions.append(
            {"action": "add_to_cart", "item_name": item_name, "price": price, "quantity": quantity})
    return {"message": "Added to cart succesfully!"}


def checkout(machine_instructions: List[Dict]) -> Dict:
    print("checkout function was called")
    machine_instructions.append({"action": "checkout"})
    return {"message": "Checkout initiated"}


async def get_completion(user_prompt, conversation_thus_far, merchant_id):
    machine_instructions = []
    INITIAL_PROMPT = f"""
You are ButlerBot - a helpful drive-through assistant with a voice interface. 

Tasks:
1. Greet the user or Take order depending upon user's prompt.
2. Confirm with price.
3. Call add_to_cart function.
4. Call checkout function when user is ready with their order.
5. Guide to the next window.

When presenting menu items from the fetched data:
- Mention the name, variation, and price of each item.
- Use conjunctions like 'and' to make it flow naturally.
- Avoid using dashes or bullet points.

Available Menu Items: {fetch_items(merchant_id)}.
"""
    
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
            "description": "Fetch menu items from the menu card.",
            "parameters": {"type": "object", "properties": {}},
        },
        {
            "name": "fetch_item_description",
            "description": "Fetch description of a particular item based on the item_name",
            "parameters": {
                "type": "object",
                "properties": {
                    "item_name": {"type": "string"},
                },
                "required": ["item_name"],
            },
        },
        {
            "name": "add_to_cart",
            "description": "Add multiple items to the cart",
            "parameters": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "item_name": {"type": "string"},
                                "price": {"type": "number"},
                                "quantity": {"type": "number"},
                            },
                            "required": ["item_name", "price", "quantity"],
                        },
                    },
                },
                "required": ["items"],
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
    logging.info("response received from %s %s %s %s",
                 AI_COMPLETION_MODEL, "in", time.time() - start_time, "seconds")
    # Print the complete response from GPT
    print(f"GPT response: {res}")

    # Check if the model wants to call a function
    if 'function_call' in res['choices'][0]['message']:
        function_name = res['choices'][0]['message']['function_call']['name']
        function_args_str = res['choices'][0]['message']['function_call'].get(
            'arguments', "{}")

        # Parse the arguments string into a Python dictionary
        function_args = json.loads(function_args_str)

        # Call the function and get the response
        if function_name == 'fetch_items':
            function_response = fetch_items(merchant_id)
        elif function_name == 'add_to_cart':
            function_response = add_to_cart(machine_instructions, **function_args)
        elif function_name == 'checkout':
            function_response = checkout(machine_instructions)
        elif function_name == 'fetch_item_description':
            function_response = fetch_item_description(item_name=function_args['item_name'], merchant_id=merchant_id)
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
        res = await openai.ChatCompletion.acreate(model=AI_COMPLETION_MODEL, messages=messages, functions=functions, function_call="none", timeout=15)

    # The model generates a user-facing message based on the function's response
    completion = res['choices'][0]['message']['content']
    logging.info('%s %s %s', AI_COMPLETION_MODEL, "response:", completion)

    return completion, machine_instructions


def _is_empty(user_prompt: str):
    return not user_prompt or user_prompt.isspace()