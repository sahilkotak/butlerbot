import base64
import json
import time
import logging
import os
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, UploadFile, BackgroundTasks, Header
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
import uvicorn


from my_api import app as my_api_app
from create_customer import get_authorization_code, create_square_customer
from get_catalog import get_catalog_items

app = FastAPI()
logging.basicConfig(level=logging.INFO)

client_id = os.environ.get("client_id")
redirect_uri = os.environ.get("REDIRECT_URL")

app.mount("/test", my_api_app)

@app.get("/products")
async def list_catalog_items():
    try:
        authorization_code = get_authorization_code(client_id, redirect_uri, "ITEMS_READ")
        catalog_items = get_catalog_items(authorization_code)
        return {"catalog_items": catalog_items}
    except Exception as e:
        return {"error": str(e)}

@app.post("/create-customer")
async def authorize_and_create_customer():
    try:
        authorization_code = get_authorization_code(client_id, redirect_uri, "CUSTOMERS_WRITE")
        customer_id = create_square_customer(authorization_code)
        return {"message": "Customer created successfully.", "customer_id": customer_id}
    except Exception as e:
        return {"error": str(e)}

@app.post("/inference")
async def infer(audio: UploadFile, background_tasks: BackgroundTasks, conversation: str = Header(default=None)) -> FileResponse:
    logging.debug("received request")
    start_time = time.time()
    user_prompt_text = await transcribe(audio)
    ai_response_text = await get_completion(user_prompt_text, conversation)
    ai_response_audio_filepath = await to_speech(ai_response_text, background_tasks)
    logging.info('total processing time: %s %s', time.time() - start_time, 'seconds')
    return FileResponse(
        path=ai_response_audio_filepath,
        media_type="audio/mpeg",
        headers={"text": _construct_response_header(user_prompt_text, ai_response_text)}
    )

@app.get("/")
async def root():
    return RedirectResponse(url="/index.html")

def _construct_response_header(user_prompt, ai_response):
    return base64.b64encode(
        json.dumps(
            [{"role": "user", "content": user_prompt}, {"role": "assistant", "content": ai_response}]
        ).encode('utf-8')
    ).decode("utf-8")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
