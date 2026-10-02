@echo off
title Visual DSA - Starting the Engine
echo =========================================================
echo   Launching Visual DSA + Lemmy AI on NVIDIA RTX 4050
echo =========================================================
echo.

:: 1. Start Ollama with RTX 4050 CUDA
echo [1/3] Starting Ollama with RTX 4050 CUDA...
start "Ollama (RTX 4050 GPU)" cmd /k "set OLLAMA_LLM_LIBRARY=cuda_v12&& set CUDA_VISIBLE_DEVICES=0&& ollama serve"

:: Wait 3 seconds for Ollama to initialize
timeout /t 3 /nobreak >nul

:: 2. Start Node.js Backend
echo [2/3] Starting Node Backend (port 5000)...
start "Node Backend" cmd /k "cd /d "%~dp0node-backend" && npm run dev"

:: Wait 2 seconds
timeout /t 2 /nobreak >nul

:: 3. Start React Frontend
echo [3/3] Starting React Frontend (port 5173)...
start "React Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Wait 3 seconds and open browser
timeout /t 3 /nobreak >nul
echo.
echo Opening http://localhost:5173 in your default browser...
start http://localhost:5173

echo.
echo =========================================================
echo   All services started! Look for Lemmy in the bottom corner!
echo =========================================================
