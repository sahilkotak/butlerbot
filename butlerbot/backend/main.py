import base64
import json
import time
import logging

from fastapi import FastAPI, UploadFile, BackgroundTasks, Header
from fastapi.responses import FileResponse
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles


from ai import get_completion
from stt import transcribe
from tts import to_speech

# Import the FastAPI app from my_api.py
from my_api import app as my_api_app
from create_customer import create_square_customer

app = FastAPI()
logging.basicConfig(level=logging.INFO)

# Mount the my_api app under a subpath, e.g., /myapi
app.mount("/test", my_api_app)

@app.post("/create-customer")
def create_customer():
    customer_data = {
    "given_name": "ramesh",
    "family_name": "aryal",
    "email_address": "ramesharyal@socoro.com.au",
    "company_name": "socoro pty ltd",
    "idempotency_key": "fe5a8692-3f14-4f45-be15-c8e51f54687a",
    "nickname": "None",
    "note": "No note",
    "birthday": "2002-10-02"
  }

    try:
        # Create a customer using the function
        customer_id = create_square_customer("EAAAEIQBQf7_4FQj3x63wAB_3ZkLFCRMuSNLthpcMADFzgKzHBPxl2dZNMCVzCdZ", customer_data)
        print (customer_id, "cssadfasl;d;fl")
        if customer_id:
            return {"message": f"Customer created with ID: {customer_id}"}
        else:
            return {"error": "Failed to create customer."}

    except Exception as e:
        print(f"Error creating customer: {e}")
        return {"error": e}


@app.post("/inference")
async def infer(audio: UploadFile, background_tasks: BackgroundTasks,
                conversation: str = Header(default=None)) -> FileResponse:
    logging.debug("received request")
    start_time = time.time()

    user_prompt_text = await transcribe(audio)
    ai_response_text = await get_completion(user_prompt_text, conversation)
    ai_response_audio_filepath = await to_speech(ai_response_text, background_tasks)

    logging.info('total processing time: %s %s', time.time() - start_time, 'seconds')
    return FileResponse(path=ai_response_audio_filepath, media_type="audio/mpeg",
                        headers={"text": _construct_response_header(user_prompt_text, ai_response_text)})


@app.get("/")
async def root():
    return RedirectResponse(url="/index.html")


app.mount("/", StaticFiles(directory="../frontend/dist"), name="static")


def _construct_response_header(user_prompt, ai_response):
    return base64.b64encode(
        json.dumps(
            [{"role": "user", "content": user_prompt}, {"role": "assistant", "content": ai_response}]).encode(
            'utf-8')).decode("utf-8")