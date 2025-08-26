\
@echo off
set PORT=%1
if "%PORT%"=="" set PORT=8000

REM mata processo escutando na porta
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>nul

start "" http://localhost:%PORT%
python -m http.server %PORT%
