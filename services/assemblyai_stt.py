import assemblyai as aai
from utils.config import ASSEMBLYAI_API_KEY
from fastapi import HTTPException

aai.settings.api_key = ASSEMBLYAI_API_KEY

def transcribe_audio(audio_bytes: bytes) -> str:
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(audio_bytes)

    if transcript.status == aai.TranscriptStatus.error:
        raise HTTPException(status_code=500, detail=transcript.error)

    return transcript.text.strip()
