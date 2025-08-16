from fastapi import APIRouter, UploadFile, File, HTTPException
from schemas.tts import TTSRequest, TTSResponse
from services.murf_tts import synthesize_speech
from services.assemblyai_stt import transcribe_audio

router = APIRouter()

@router.post("/generate-audio", response_model=TTSResponse)
def generate_audio(request: TTSRequest):
    audio_url = synthesize_speech(request.text)
    return TTSResponse(audio_url=audio_url, transcript=request.text)

@router.post("/tts/echo", response_model=TTSResponse)
async def tts_echo(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript = transcribe_audio(audio_bytes)
    if not transcript:
        raise HTTPException(status_code=400, detail="No text detected in audio")
    
    audio_url = synthesize_speech(transcript)
    return TTSResponse(audio_url=audio_url, transcript=transcript)
