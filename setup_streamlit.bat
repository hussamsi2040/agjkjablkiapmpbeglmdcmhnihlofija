@echo off
echo Setting up CollegeEssayAI Streamlit App...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed.
    echo Please install Python from https://python.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo Python is installed. Installing dependencies...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To start the Streamlit app:
echo 1. Run: streamlit run app.py
echo 2. The app will open in your browser automatically
echo 3. Get your OpenRouter API key from https://openrouter.ai/keys
echo 4. Enter your API key in the sidebar and start generating essays!
echo.
pause 