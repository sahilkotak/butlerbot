import base64
import json
import time
import logging
from fastapi import FastAPI, UploadFile, BackgroundTasks, Header
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from fastapi.middleware.cors import CORSMiddleware

from my_api import app as my_api_app
from SquareAPI.square_api import app as square_api_app

app = FastAPI()
access_tokens ={}
logging.basicConfig(level=logging.INFO)
origins = [
    # "https://076d-125-168-79-45.ngrok-free.app",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.mount("/test", my_api_app)
app.mount("/square/", square_api_app)

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
