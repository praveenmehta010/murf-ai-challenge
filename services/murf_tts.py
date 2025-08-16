import requests
from utils.config import MURF_TTS_API_KEY, MURF_TTS_ENDPOINT
from fastapi import HTTPException

def synthesize_speech(text: str, voice_id: str = "en-US-natalie") -> str:
    headers = {"api-key": MURF_TTS_API_KEY}
    payload = {"text": text, "voiceId": voice_id}
    
    response = requests.post(MURF_TTS_ENDPOINT, headers=headers, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    audio_url = response.json().get("audioFile")
    if not audio_url:
        raise HTTPException(status_code=500, detail="No audio URL returned from Murf API")
    
    return audio_url
