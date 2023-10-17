### TODO: Add CORS origin restriction
import base64

import json
import os
import time
import logging
from square_api.merchant import Merchant


from fastapi import FastAPI, UploadFile, BackgroundTasks, Header
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from ai import get_completion
from google_api.stt import transcribe
from google_api.tts import to_speech
from square_api.square_app import authorise, authorize_callback, create_checkout, getItems
import uvicorn
from context import get_merchant_id

app = FastAPI()
logging.basicConfig(level=logging.INFO)
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.get("/authorise")
async def authorise_client():
    return authorise()

@app.get("/authorise-callback")
async def authorise_callback(
    code: str = None, 
    state: str = None, 
    response_type: str = None,
    error: str = None,
    error_description: str = None,
    cookie: str = Header(None)
):
    return await authorize_callback(
        query_params={
            "code": code,
            "state": state,
            "response_type": response_type,
            "error": error,
            "error_description": error_description,
        },
        cookie=cookie
    )

@app.post("/checkout")
async def checkout(data: dict, authorization: str = Header(None), locationId: str = Header(None)):
    
    checkout_params = {
        "access_token": authorization,
        "locationId": locationId,
        "data": data,
    }
    return await create_checkout(checkout_params)

@app.get("/get-menu")
async def get_menu(ButlerbotMerchantId: str = Header(None)):
    query_params = {
        "merchant_id": ButlerbotMerchantId,
    }
    logging.info("qp: ", query_params)
    merchant = Merchant()
    return merchant.get_menu(query_params)

@app.post("/inference")
async def infer(audio: UploadFile, background_tasks: BackgroundTasks, conversation: str = Header(default=None), merchant_id: str = Depends(get_merchant_id)):
    logging.debug("received request")
    start_time = time.time()
    user_prompt_text, error_occurred = await transcribe(audio, merchant_id)
    ai_response_text, machine_instructions = (user_prompt_text, None) if error_occurred else await get_completion(user_prompt_text, conversation, merchant_id)
    ai_response_audio_filepath = await to_speech(ai_response_text, background_tasks)
    logging.info('total processing time: %s %s', time.time() - start_time, 'seconds')
    with open(ai_response_audio_filepath, "rb") as audio_file:
        audio_data = audio_file.read()
    response = {
        "createdOn": start_time,
        "user_prompt": None if error_occurred else user_prompt_text,
        "ai_response": ai_response_text,
        "instructions": machine_instructions,
        "audio_data": base64.b64encode(audio_data).decode('utf-8')
    }
    return JSONResponse(content=response, headers={"text": _construct_response_header(user_prompt_text, ai_response_text)})

@app.get("/")
async def root():
    return RedirectResponse(url="/index.html")

app.mount("/", StaticFiles(directory="../frontend/dist"), name="static")

def _construct_response_header(user_prompt, ai_response):
    return base64.b64encode(
        json.dumps(
            [{"role": "user", "content": user_prompt}, {"role": "assistant", "content": ai_response}]
        ).encode('utf-8')
    ).decode("utf-8")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
