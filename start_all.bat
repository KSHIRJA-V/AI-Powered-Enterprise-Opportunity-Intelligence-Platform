@echo off
echo ===================================================
echo Launching Enterprise Opportunity Intelligence Platform...
echo ===================================================
start "Backend Server" cmd /k "start_backend.bat"
start "Frontend Dashboard" cmd /k "start_frontend.bat"
echo Services are launching!
echo Backend API Docs: http://localhost:8000/docs
echo Frontend UI:      http://localhost:5173
