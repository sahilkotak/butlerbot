import logging
import os
import time
import uuid

from gtts import gTTS

LANGUAGE = os.getenv("LANGUAGE", "en")
TTS_PROVIDER = os.getenv("TTS_PROVIDER", "EDGETTS")


def to_speech(text):
    start_time = time.time()

    tts = gTTS(text, lang=LANGUAGE)
    filepath = f"/tmp/{uuid.uuid4()}.mp3"
    tts.save(filepath)

    logging.info('TTS time: %s %s', time.time() - start_time, 'seconds')
    return filepath