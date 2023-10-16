import logging
import os
import shutil
import time
import uuid

import ffmpeg
from google.cloud import speech
from pydub.utils import mediainfo

LANGUAGE = os.getenv("LANGUAGE", "en-US")

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

    # Instantiates a client
    client = speech.SpeechClient()

    # Loads the audio into memory
    with open(converted_filepath, "rb") as audio_file:
        audio_content = audio_file.read()
        audio = speech.RecognitionAudio(content=audio_content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code=LANGUAGE,
        model='phone_call',  # Adjusted model parameter for better results
    )

    # Log the request details
    audio_info = mediainfo(converted_filepath)
    logging.info('STT request details: config=%s, audio_info=%s', config, audio_info)

    # Detects speech in the audio file
    response = client.recognize(config=config, audio=audio)

    for result in response.results:
        transcription = result.alternatives[0].transcript

    logging.info("STT response received from Google Speech to Text in %s %s", time.time() - start_time, 'seconds')
    logging.info('STT response: %s', response)
    logging.info('STT results: %s', response.results)
    logging.info('user prompt: %s', transcription)

    return transcription
