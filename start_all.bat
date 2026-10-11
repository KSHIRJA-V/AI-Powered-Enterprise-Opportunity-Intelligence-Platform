@echo off
echo ===================================================
echo Launching Enterprise Opportunity Intelligence Platform...
echo ===================================================
cd /d "%~dp0"
start "Backend Server (FastAPI)" cmd /k "call "%~dp0start_backend.bat""
start "Frontend Dashboard (Vite)" cmd /k "call "%~dp0start_frontend.bat""
echo Services are launching!
echo Backend API Docs: http://localhost:8000/docs
echo Frontend UI:      http://localhost:5173
