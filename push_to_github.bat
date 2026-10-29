@echo off
setlocal
title Push CircuitVerse AI to GitHub
echo ========================================================
echo   Pushing CircuitVerse AI to GitHub
echo   Repository: https://github.com/sohamraj0076-max/chakravyuh-Innovexa-T106
echo ========================================================
echo.

cd /d "C:\Users\ADMIN\.gemini\antigravity\scratch\circuitverse-ai"

set "GIT_EXE=C:\Program Files\Git\ucrt64\libexec\git-core\git.exe"
if not exist "%GIT_EXE%" set "GIT_EXE=git"

echo Configuring origin remote...
"%GIT_EXE%" remote set-url origin https://github.com/sohamraj0076-max/chakravyuh-Innovexa-T106.git 2>nul
if %errorlevel% neq 0 (
  "%GIT_EXE%" remote add origin https://github.com/sohamraj0076-max/chakravyuh-Innovexa-T106.git
)

echo.
echo Pushing branch 'main' to GitHub...
echo (A browser window may open to authenticate with GitHub)
echo.

"%GIT_EXE%" push -u origin main

if %errorlevel% equ 0 (
  echo.
  echo ========================================================
  echo   SUCCESS: Project successfully uploaded to GitHub!
  echo   View at: https://github.com/sohamraj0076-max/chakravyuh-Innovexa-T106
  echo ========================================================
) else (
  echo.
  echo [Notice] If the push failed due to authentication, you can also push
  echo using a GitHub Personal Access Token (PAT).
)

pause
