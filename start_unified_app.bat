@echo off
echo ========================================
echo   AI Trip Planner - Unified App
echo ========================================
echo.
echo Checking for existing processes...
taskkill /F /IM python.exe 2>nul
echo.
echo Starting FastAPI Backend (Port 8002)...
start "FastAPI Backend" cmd /k "D:/Projects/AI_Trip_Planner/env/Scripts/python.exe main_simple.py"
echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul
echo.
echo Starting Unified Flask App (Port 3000)...
echo Frontend + API will be available at: http://localhost:3000
echo API endpoints: /api/query, /api/health
echo.
echo Press Ctrl+C to stop the application
echo.
D:/Projects/AI_Trip_Planner/env/Scripts/python.exe unified_app.py
