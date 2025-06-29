import requests
import json

def test_text_api(api_key):
    """Test OpenRouter API with text-only request"""
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://college-essay-ai.test",
        "X-Title": "CollegeEssayAI Test"
    }
    
    data = {
        "model": "openai/o4-mini",  # Correct model name
        "messages": [
            {
                "role": "user",
                "content": "Say 'Hello, text API is working!'"
            }
        ],
        "max_tokens": 50,
        "temperature": 0.7
    }
    
    try:
        print("🔍 Testing Text API...")
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print("✅ Text API SUCCESS!")
            print(f"📄 Response: {content}")
            return True
        else:
            print(f"❌ Text API Error: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Text API Exception: {str(e)}")
        return False

def test_image_api(api_key):
    """Test OpenRouter API with image analysis"""
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://college-essay-ai.test",
        "X-Title": "CollegeEssayAI Test"
    }
    
    data = {
        "model": "openai/gpt-4o-mini",  # This model supports images
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What is in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 100,
        "temperature": 0.7
    }
    
    try:
        print("\n🖼️ Testing Image API...")
        response = requests.post(url, headers=headers, json=data, timeout=60)
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print("✅ Image API SUCCESS!")
            print(f"📄 Response: {content}")
            return True
        else:
            print(f"❌ Image API Error: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Image API Exception: {str(e)}")
        return False

def test_available_models(api_key):
    """Test which models are available with your API key"""
    
    url = "https://openrouter.ai/api/v1/models"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        print("\n📋 Testing Available Models...")
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            models = response.json()
            print("✅ Available Models:")
            for model in models.get('data', [])[:5]:  # Show first 5 models
                print(f"   - {model.get('id', 'Unknown')}")
            return True
        else:
            print(f"❌ Models API Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Models API Exception: {str(e)}")
        return False

def main():
    print("🚀 OpenRouter API Comprehensive Test")
    print("=" * 60)
    
    # Get API key from user
    api_key = input("Enter your OpenRouter API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided")
        return
    
    if not api_key.startswith("sk-"):
        print("❌ Invalid API key format. Should start with 'sk-'")
        return
    
    print(f"🔑 API Key: {api_key[:10]}...{api_key[-4:]}")
    print("-" * 60)
    
    # Test text API
    text_success = test_text_api(api_key)
    
    # Test image API
    image_success = test_image_api(api_key)
    
    # Test available models
    models_success = test_available_models(api_key)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY:")
    print(f"   Text API: {'✅ PASS' if text_success else '❌ FAIL'}")
    print(f"   Image API: {'✅ PASS' if image_success else '❌ FAIL'}")
    print(f"   Models API: {'✅ PASS' if models_success else '❌ FAIL'}")
    
    if text_success:
        print("\n🎉 Your API key is working! You can use it in the Streamlit app.")
        print("💡 For college essays, use the 'openai/o4-mini' model.")
    else:
        print("\n🔧 Please fix the API key issues before using the Streamlit app.")
        print("💡 Get a fresh API key from: https://openrouter.ai/keys")
    
    print("\n" + "=" * 60)
    input("Press Enter to exit...")

if __name__ == "__main__":
    main() 