# 🎙️ 30 Days of AI Voice Agents – Murf AI Challenge

An interactive voice-based chatbot powered by **FastAPI**, **Murf TTS**, **AssemblyAI Speech-to-Text**, and **Google Gemini LLM**.  
This project lets you talk to an AI agent using your microphone, transcribes your speech, processes it via Gemini, and replies with natural-sounding speech.

---

## 🚀 Features

- **🎤 Real-time Voice Recording** – Record directly from the browser
- **🗣️ Speech-to-Text (STT)** – Uses AssemblyAI to transcribe speech
- **🧠 LLM Responses** – Processes messages using Google Gemini
- **🔊 Text-to-Speech (TTS)** – Uses Murf API to generate lifelike audio responses
- **💬 Chat History** – Keeps multi-turn conversation context
- **⚠️ Error Handling** – Plays fallback audio in case of API failure
- **📱 Clean UI** – HTML + CSS with animated buttons and chat bubbles

---

## 🛠️ Tech Stack

### Backend
- **Python 3.9+**
- **FastAPI** – API framework
- **Jinja2** – Template rendering
- **httpx** – Async HTTP calls to APIs

### Frontend
- **Vanilla JavaScript**
- **HTML5 & CSS3**
- **Fetch API** – Send audio data & receive AI responses

### AI & APIs
- **Murf API** – Text-to-Speech
- **AssemblyAI API** – Speech-to-Text
- **Google Gemini API** – AI chat responses

---

## 🏗️ Architecture Overview

1. **User clicks record** → Microphone input captured via `MediaRecorder API`
2. Audio blob sent to **FastAPI backend** (`/process-audio`)
3. Backend sends audio to **AssemblyAI** → gets transcribed text
4. Transcribed text sent to **Gemini LLM** → gets AI response
5. Response text sent to **Murf API** → gets generated speech
6. Audio + text sent back to frontend → displayed in chat + played in browser

---

## 📦 Installation & Setup

### 1️⃣ Clone this repository
- git clone https://github.com/yourusername/murf-ai-challenge.git
- cd murf-ai-challenge

### 2️⃣ Create a virtual environment & install dependencies
- python -m venv venv
- source venv/bin/activate  # macOS/Linux
- venv\Scripts\activate     # Windows

- pip install -r requirements.txt

### 3️⃣ Set up Environment Variables
- Create a .env file in the root directory and add:
- MURF_API_KEY=your_murf_api_key
- ASSEMBLYAI_API_KEY=your_assemblyai_api_key
- GEMINI_API_KEY=your_gemini_api_key

### 4️⃣ Run the FastAPI server
- uvicorn main:app --reload
- The app will be available at:
- ➡️ http://127.0.0.1:8000

### 5️⃣ Open the app in your browser
- Go to the above link and start chatting 🎧

---
### 📸 Screenshots
- <img width="2239" height="1194" alt="Screenshot 2025-08-14 095416" src="https://github.com/user-attachments/assets/544f7f76-c580-43cf-a2be-3539a71cdaec" />



---
### 📜 License
- This project is licensed under the MIT License – see the LICENSE file for details.

---
### 🌟 Acknowledgements
- Murf AI for lifelike TTS
- AssemblyAI for powerful STT
- Google Gemini for conversational intelligence
- FastAPI for backend magic
