# 🚀 Starting the Engine: Visual DSA + Lemmy AI (RTX 4050)

This guide contains all the commands to start the entire Visual DSA platform with **Lemmy the Cartoon AI Assistant** powered by your **NVIDIA RTX 4050 GPU**.

---

## ⚡ 1-Click Launch (Easiest Method)

Double-click the [`start-engine.bat`](file:///c:/Users/Dharaneesh%20V/OneDrive/idk/Web%20Application/React/Visual%20DSA/start-engine.bat) file in the root folder, or run it from terminal:

```cmd
start-engine.bat
```

This will automatically launch Ollama (with RTX 4050 CUDA), the Node.js backend, and the React frontend in separate windows, and open Visual DSA in your browser!

---

## 🛠️ Manual Terminal Commands (3 Steps)

If you prefer opening separate terminal windows yourself, follow these 3 commands:

### Terminal 1: Start Ollama (RTX 4050 GPU Engine)
```powershell
$env:OLLAMA_LLM_LIBRARY="cuda_v12"
$env:CUDA_VISIBLE_DEVICES="0"
ollama serve
```

> **Verify GPU status (optional):** In any terminal, run:
> ```powershell
> ollama ps
> ```
> It should display: `PROCESSOR: 100% GPU`.

---

### Terminal 2: Start the Backend (Port 5000)
```powershell
cd "c:\Users\Dharaneesh V\OneDrive\idk\Web Application\React\Visual DSA\node-backend"
npm run dev
```

---

### Terminal 3: Start the Frontend (Port 5173)
```powershell
cd "c:\Users\Dharaneesh V\OneDrive\idk\Web Application\React\Visual DSA\frontend"
npm run dev
```

---

## 🌐 Open in Browser

Navigate to:
```
http://localhost:5173
```

---

## 🦫 How to Use Lemmy:
1. Click on **Lemmy** in the bottom-right corner (or drag him anywhere on screen!).
2. In the header, check that the status indicator says **`🟢 RTX 4050 AI`**.
3. Go to the **💬 Ask** tab, type any DSA question, and hit Enter.
4. Try Lemmy's action moves: click **`⚡ Moves`** to make him do a **Backflip (`🤸`)**, **Rocket Jump (`🚀`)**, **Munch Acorns (`🌰`)**, or **Nap (`💤`)**!
5. Toggle **`🔊`** to hear Lemmy speak his explanations out loud.
