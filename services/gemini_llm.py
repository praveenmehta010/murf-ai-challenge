import requests
from utils.config import GEMINI_API_KEY, GEMINI_API_URL
from fastapi import HTTPException

def query_llm(user_text: str, chat_history: list = None) -> str:
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }

    if chat_history:
        payload = {"contents": chat_history}
    else:
        payload = {
            "contents": [{"parts": [{"text": user_text}]}]
        }

    response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    data = response.json()
    model_reply = (
        data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
    )
    if not model_reply:
        raise HTTPException(status_code=500, detail="No text returned from Gemini LLM")

    return model_reply
