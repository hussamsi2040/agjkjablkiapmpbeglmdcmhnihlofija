import requests
import json

# Replace with your actual API key
API_KEY = "sk-your-actual-api-key-here"  # CHANGE THIS!

def test_api():
    print("🚀 Testing OpenRouter API...")
    print(f"🔑 API Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    print("-" * 50)
    
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://college-essay-ai.test",
            "X-Title": "CollegeEssayAI Test",
        },
        data=json.dumps({
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
        })
    )
    
    print(f"📊 Status Code: {response.status_code}")
    print(f"📄 Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        result = response.json()
        content = result['choices'][0]['message']['content']
        print("✅ SUCCESS!")
        print(f"📝 Response: {content}")
    else:
        print("❌ ERROR!")
        print(f"📄 Error Response: {response.text}")
        
        if response.status_code == 401:
            print("\n💡 401 Error Solutions:")
            print("   - Get a new API key from https://openrouter.ai/keys")
            print("   - Make sure you have credits in your account")
            print("   - Check that the key starts with 'sk-'")
        elif response.status_code == 403:
            print("\n💡 403 Error Solutions:")
            print("   - Try a different model")
            print("   - Check your account permissions")
        elif response.status_code == 429:
            print("\n💡 429 Error Solutions:")
            print("   - Wait a few minutes and try again")
            print("   - Check your rate limits")

if __name__ == "__main__":
    # Instructions
    print("📋 INSTRUCTIONS:")
    print("1. Edit this file and replace 'sk-your-actual-api-key-here' with your real API key")
    print("2. Save the file")
    print("3. Run: python test_simple.py")
    print("=" * 50)
    
    if API_KEY == "sk-your-actual-api-key-here":
        print("❌ Please edit the API_KEY variable with your actual key first!")
    else:
        test_api()
    
    print("\n" + "=" * 50)
    input("Press Enter to exit...") 