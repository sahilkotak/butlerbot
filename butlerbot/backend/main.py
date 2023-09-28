import base64
import json
import time
import logging
from fastapi import FastAPI, UploadFile, BackgroundTasks, Header
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from my_api import app as my_api_app

app = FastAPI()
logging.basicConfig(level=logging.INFO)

# Mount the my_api app under a subpath, e.g., /test
app.mount("/test", my_api_app)

from create_customer import get_authorization_code, create_square_customer  # Import these functions

@app.post("/create-customer")
async def authorize_and_create_customer():
    try:

        client_id = "sq0idp-6aYBSQ_b6TCjM0iJ2viLFw"
        redirect_uri = "https://ntibnportal.powerappsportals.com/"

        authorization_code = get_authorization_code(client_id, redirect_uri, "CUSTOMERS_WRITE")
        print("authorization_code", authorization_code)

        customer_id = create_square_customer(authorization_code)
        print(f"Access Token: {customer_id}")
        
        return {"message": "Customer created successfully.", "customer_id": customer_id}  # Optionally, return a response to the client
    except Exception as e:
        return {"error": str(e)}  # Handle exceptions and return an error response if needed

@app.post("/inference")
async def infer(audio: UploadFile, background_tasks: BackgroundTasks,
                conversation: str = Header(default=None)) -> FileResponse:
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
