from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from routes import tts_routes
from utils.config import *

app = FastAPI(title="Voice Echo Bot")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "Voice Echo Bot",
            "murf_key_status": bool(MURF_TTS_API_KEY),
            "assemblyai_key_status": bool(ASSEMBLYAI_API_KEY),
            "gemini_key_status": bool(GEMINI_API_KEY)
        }
    )

app.include_router(tts_routes.router, prefix="/tts", tags=["Text-to-Speech"])
