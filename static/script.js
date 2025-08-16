
let isRecording = false;

const recordBtn = document.getElementById("record-btn");

recordBtn.addEventListener("click", async () => {
    if (!isRecording) {
        await startRecording("agent"); // Start in agent mode
        isRecording = true;
        recordBtn.textContent = "⏹ Stop Recording";
        recordBtn.classList.add("recording"); // Optional: for CSS animation
    } else {
        stopRecording();
        isRecording = false;
        recordBtn.textContent = "🎤 Start Recording";
        recordBtn.classList.remove("recording");
    }
});

let hasMurfApiKey = false;

// async function fetchConfig() {
//     try {
//         const res = await fetch("/config");
//         if (res.ok) {
//             const data = await res.json();
//             hasMurfApiKey = data.hasMurfApiKey;
//             console.log("Murf API Key available:", hasMurfApiKey);
//         } else {
//             console.warn("Failed to fetch config");
//         }
//     } catch (e) {
//         console.error("Error fetching config:", e);
//     }
// }

// Call this once when the page loads
// fetchConfig();

// ===== Utility Functions =====
function updateStatus(message, isRecording = false) {
    const statusDiv = document.getElementById("recording-status");
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");

    statusDiv.textContent = message;
    statusDiv.style.color = isRecording ? "#d63031" : "#2d3436";

    if (startBtn && stopBtn) {
        startBtn.disabled = isRecording;
        stopBtn.disabled = !isRecording;
        startBtn.textContent = isRecording ? "Recording..." : "Start Recording";
        stopBtn.textContent = "Stop Recording";
    }
}

// function addChatMessage(role, text) {
//     const chatBox = document.getElementById("chat-box");
//     const msgDiv = document.createElement("div");
//     msgDiv.classList.add("chat-message", role);
//     msgDiv.textContent = text;
//     chatBox.appendChild(msgDiv);
//     chatBox.scrollTop = chatBox.scrollHeight;
// }

function addChatMessage(role, text) {
    const chatBox = document.getElementById("chat-box");

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", role);
    msgDiv.textContent = role;

    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble");
    bubble.textContent = text;

    msgDiv.appendChild(bubble);
    chatBox.appendChild(msgDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

// ===== Task 1 Example =====
function msg() {
    // alert("Task 1 completed!!!");
    /// delete this part
    // Play fallback local audio file if no API key
    const fallbackAudio = document.getElementById("murf-echo-audio");
    fallbackAudio.src = "../uploads/a.m4a"; // your local fallback audio path
    fallbackAudio.play();
    // updateStatus("Playing fallback audio (API key missing).");
}

function s2() {
    console.log("hello");
}

// ===== Task 3: TTS from Text =====
async function generateAndPlay() {
    const input = document.getElementById("tts-input").value.trim();
    const audio = document.getElementById("tts-audio");

    if (!input) {
        alert("Please enter some text.");
        return;
    }

    try {
        updateStatus("Generating speech...");
        const response = await fetch("/generate-audio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        if (!data.audioFile) throw new Error("Audio URL missing.");
        audio.src = data.audioFile;
        await audio.play();

        addChatMessage("user", input);
        updateStatus("✅ Speech ready!");
    } catch (err) {
        console.error(err);
        updateStatus("❌ Failed to generate audio.");
    }
}

// ===== Recording Control =====
let mediaRecorder;
let audioChunks = [];



async function startRecording(mode = "llm") {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

            if (mode === "echo") return processAudioEcho(audioBlob);
            if (mode === "llm") return processAudioWithLLM(audioBlob);
            if (mode === "agent") return processAudioWithChatHistory(audioBlob);
        };

        mediaRecorder.start();
        updateStatus("🔴 Recording...", true);
    } catch (error) {
        console.error("Microphone access denied:", error);
        alert("Microphone access is required.");
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        updateStatus("Recording stopped.");
        mediaRecorder.stop();
    }
}

// ===== Upload Audio (Optional) =====
async function uploadAudio(blob) {

    updateStatus("Uploading audio...");
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
        const response = await fetch("/upload-audio", {
            method: "POST",
            body: formData
        });
        if (!response.ok) throw new Error("Upload failed.");

        const result = await response.json();
        updateStatus(`✅ Uploaded: ${result.filename} (${Math.round(result.size / 1024)} KB)`);
    } catch (err) {
        console.error(err);
        updateStatus("❌ Upload failed.");
    }
}

// ===== Echo Bot =====
async function processAudioEcho(blob) {
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
        const response = await fetch("/tts/echo", { method: "POST", body: formData });
        // console.log("hello")
        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        addChatMessage("user", data.transcript || "No transcript");
        addChatMessage("assistant", `(Echo) ${data.transcript}`);

        const echoAudio = document.getElementById("murf-echo-audio");
        echoAudio.src = data.audio_url;
        echoAudio.play();
    } catch (err) {
        console.error(err);
        updateStatus("❌ Echo failed.");
    }
}

// ===== LLM Single-Turn =====
async function processAudioWithLLM(blob) {
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
        updateStatus("⏳ Processing...");
        const response = await fetch("/llm/query", { method: "POST", body: formData });
        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        addChatMessage("user", data.user_transcript);
        addChatMessage("assistant", data.llm_response);

        const murfAudio = document.getElementById("murf-echo-audio");
        murfAudio.src = data.audio_url;
        murfAudio.play();

        updateStatus("✅ Response ready!");
    } catch (err) {
        const fallbackAudio = document.getElementById("murf-echo-audio");
        fallbackAudio.src = "../uploads/recording.webm"; // your local fallback audio path
        fallbackAudio.play();
        // console.log("hellowssssssss")
        console.error(err);
        updateStatus("❌ LLM processing failed.");
    }
}

// ===== LLM Multi-Turn (Agent) =====
let sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
localStorage.setItem("sessionId", sessionId);

async function processAudioWithChatHistory(blob) {
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
        updateStatus("⏳ Processing with history...");
        const response = await fetch(`/agent/chat/${sessionId}`, {
            method: "POST",
            body: formData
        });
        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        addChatMessage("user", data.user_transcript);
        addChatMessage("assistant", data.llm_response);

        const murfAudio = document.getElementById("murf-echo-audio");
        murfAudio.src = data.audio_url;
        murfAudio.play();

        murfAudio.onended = () => startRecording("agent");
        updateStatus("✅ Agent reply ready!");
    } catch (err) {
        console.error(err);
        updateStatus("❌ Agent chat failed.");
    }
}