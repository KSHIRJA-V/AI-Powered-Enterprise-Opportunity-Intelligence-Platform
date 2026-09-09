@echo off
echo ===================================================
echo Launching TransforMind AI (Backend + Frontend)...
echo ===================================================
start "TransforMind Backend" cmd /k "start_backend.bat"
start "TransforMind Frontend" cmd /k "start_frontend.bat"
echo Services are launching!
echo Backend API Docs: http://localhost:8000/docs
echo Frontend UI:      http://localhost:5173
