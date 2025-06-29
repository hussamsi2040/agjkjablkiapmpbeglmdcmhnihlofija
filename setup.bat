@echo off
echo Installing EssayAI dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo Node.js is installed. Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To start the application:
echo 1. Run: npm start
echo 2. Open http://localhost:3000 in your browser
echo 3. Make sure you are logged into ChatGPT at https://chat.openai.com in another tab
echo.
pause 