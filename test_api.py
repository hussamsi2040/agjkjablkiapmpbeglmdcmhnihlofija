import requests
import json

def test_openrouter_api(api_key):
    """Test OpenRouter API with a simple request"""
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://test-app.com",
        "X-Title": "API Test"
    }
    
    data = {
        "model": "openai/o4-mini",
        "messages": [
            {
                "role": "user",
                "content": "Say 'Hello, API is working!'"
            }
        ],
        "max_tokens": 50,
        "temperature": 0.7
    }
    
    try:
        print("🔍 Testing OpenRouter API...")
        print(f"📝 API Key: {api_key[:10]}...{api_key[-4:]}")
        print(f"🤖 Model: openai/o4-mini")
        print("-" * 50)
        
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print("✅ SUCCESS! API is working correctly.")
            print(f"📄 Response: {content}")
            return True
        elif response.status_code == 401:
            print("❌ AUTHENTICATION ERROR: Invalid API key")
            print("💡 Solutions:")
            print("   - Get a new API key from https://openrouter.ai/keys")
            print("   - Make sure you have credits in your account")
            print("   - Check that the key starts with 'sk-'")
            return False
        elif response.status_code == 403:
            print("❌ ACCESS DENIED: No permission for this model")
            print("💡 Try a different model or check your account permissions")
            return False
        elif response.status_code == 429:
            print("❌ RATE LIMIT: Too many requests")
            print("💡 Wait a few minutes and try again")
            return False
        else:
            print(f"❌ ERROR: HTTP {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ TIMEOUT: Request took too long")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION ERROR: Check your internet connection")
        return False
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 OpenRouter API Test Tool")
    print("=" * 50)
    
    # Get API key from user
    api_key = input("Enter your OpenRouter API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided")
    elif not api_key.startswith("sk-"):
        print("❌ Invalid API key format. Should start with 'sk-'")
    else:
        # Test the API
        success = test_openrouter_api(api_key)
        
        if success:
            print("\n🎉 Your API key is working! You can use it in the Streamlit app.")
        else:
            print("\n🔧 Please fix the issues above before using the Streamlit app.")
    
    print("\n" + "=" * 50)
    input("Press Enter to exit...") 