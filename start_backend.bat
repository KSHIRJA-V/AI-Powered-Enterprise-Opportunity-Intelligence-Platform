@echo off
echo ===================================================
echo Starting Backend Server (FastAPI)...
echo ===================================================
cd /d "%~dp0backend"
py -3.10 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
