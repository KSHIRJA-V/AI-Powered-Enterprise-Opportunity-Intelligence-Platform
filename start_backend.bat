@echo off
echo ===================================================
echo Starting TransforMind AI FastAPI Backend Server...
echo ===================================================
cd backend
py -3.10 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
