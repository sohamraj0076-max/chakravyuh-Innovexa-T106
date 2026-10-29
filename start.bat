@echo off
setlocal
title CIRCUITVERSE AI - Smart ENTC Learning Platform
echo ========================================================
echo   CIRCUITVERSE AI - CHAKRAVYUH Hackathon
echo   Learn Circuits. Simulate Ideas. Build Intelligence.
echo ========================================================
echo.

:: Ensure node is in PATH if installed in local AppData
if exist "C:\Users\ADMIN\AppData\Local\Programs\nodejs\node.exe" (
  set "PATH=C:\Users\ADMIN\AppData\Local\Programs\nodejs;%PATH%"
)

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] Node.js executable not found in PATH or standard user directories.
  echo Please install Node.js v18+ or run from an environment with node.exe.
  pause
  exit /b 1
)

echo Starting backend server on http://localhost:3000 ...
echo Database: SQLite native persistence (circuitverse.db)
echo.

node server.js
pause
