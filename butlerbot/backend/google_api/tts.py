import logging
import os
import time
import uuid
from util import delete_file

from google.cloud import texttospeech

LANGUAGE = os.getenv("LANGUAGE", "en")
TTS_PROVIDER = os.getenv("TTS_PROVIDER", "Google Cloud Text-to-Speech")

async def to_speech(text, background_tasks):
    start_time = time.time()

    client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=LANGUAGE, ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )

    # Use os.path.join to create the filepath
    filepath = os.path.join(os.getcwd(), "dist", f"{uuid.uuid4()}.mp3")
    logging.debug(f"Attempting to save TTS output to {filepath}")

    # Check if the directory exists, if not, create it
    directory = os.path.dirname(filepath)
    if not os.path.exists(directory):
        os.makedirs(directory)

    try:
        with open(filepath, "wb") as out:
            out.write(response.audio_content)
            logging.debug(f"Saved TTS output to {filepath}")
    except Exception as e:
        logging.error(f"Failed to save TTS output to {filepath}. Error: {str(e)}")
        return None

    background_tasks.add_task(delete_file, filepath)

    logging.info('TTS time: %s %s', time.time() - start_time, 'seconds')
    return filepath