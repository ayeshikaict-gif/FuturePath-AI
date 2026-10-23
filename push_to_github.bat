@echo off
setlocal
cd /d "%~dp0"

:: Ensure Git is in PATH
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;C:\Program Files\Git\cmd;%PATH%"
)

echo ====================================================
echo   FuturePath AI - Upload to GitHub (ayeshikaict-gif)
echo ====================================================
echo.

set REPO_NAME=FuturePath-AI
set /p USER_REPO="Enter repository name [Press Enter for default: %REPO_NAME%]: "
if not "%USER_REPO%"=="" set REPO_NAME=%USER_REPO%

echo.
echo Target GitHub URL: https://github.com/ayeshikaict-gif/%REPO_NAME%.git
echo.
echo Make sure you have created the empty repository on GitHub first:
echo   https://github.com/new
echo   (Set Repository name: %REPO_NAME%, do NOT check 'Add README')
echo.
pause

git remote remove origin 2>nul
git remote add origin https://github.com/ayeshikaict-gif/%REPO_NAME%.git
git branch -M main

echo.
echo Pushing project to https://github.com/ayeshikaict-gif/%REPO_NAME%.git ...
echo (If prompted, sign in with your browser to authorize GitHub)
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo   SUCCESS! Project uploaded to GitHub:
    echo   https://github.com/ayeshikaict-gif/%REPO_NAME%
    echo ====================================================
) else (
    echo.
    echo Push failed. Please check that:
    echo 1. You created the repository at https://github.com/new
    echo 2. You authorized your GitHub account in the browser prompt.
)

pause
