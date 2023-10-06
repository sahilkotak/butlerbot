### TODO: Remove FFMPEG dependency and convert into AWS Elastic Transcoder to convert the audio file.
### TODO: Change Whisper implementation to Google Speech to Text

import logging
import os
import shutil
import time
import uuid

import ffmpeg
import openai

LANGUAGE = os.getenv("LANGUAGE", "en")

import tempfile

async def transcribe(audio):
    start_time = time.time()
    
    # Use tempfile to get a platform-independent temp directory
    temp_dir = tempfile.gettempdir()

    # Construct file paths
    initial_filepath = os.path.join(temp_dir, f"{uuid.uuid4()}{audio.filename}")
    converted_filepath = os.path.join(temp_dir, f"ffmpeg-{uuid.uuid4()}{audio.filename}")

    with open(initial_filepath, "wb+") as file_object:
        shutil.copyfileobj(audio.file, file_object)

    logging.debug("running through ffmpeg")
    (
        ffmpeg
        .input(initial_filepath)
        .output(converted_filepath, loglevel="error")
        .run()
    )
    logging.debug("ffmpeg done")


    with open(converted_filepath, "rb") as read_file:
        logging.debug("calling whisper")
        transcription = (await openai.Audio.atranscribe("whisper-1", read_file, language=LANGUAGE))["text"]

    logging.info("STT response received from whisper in %s %s", time.time() - start_time, 'seconds')
    logging.info('user prompt: %s', transcription)

    return transcription
