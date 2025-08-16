import os
from dotenv import load_dotenv

load_dotenv()

MURF_TTS_API_KEY = os.getenv("MURF_API_KEY")
MURF_TTS_ENDPOINT = os.getenv("MURF_TTS_ENDPOINT")

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = os.getenv("GEMINI_API_URL")

if not MURF_TTS_API_KEY or not MURF_TTS_ENDPOINT:
    raise RuntimeError("Murf TTS configuration missing")

if not ASSEMBLYAI_API_KEY:
    raise RuntimeError("AssemblyAI configuration missing")

if not GEMINI_API_KEY or not GEMINI_API_URL:
    raise RuntimeError("Gemini configuration missing")
