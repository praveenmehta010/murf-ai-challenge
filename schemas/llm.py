from pydantic import BaseModel

class LLMResponse(BaseModel):
    user_transcript: str
    llm_response: str
    audio_url: str
