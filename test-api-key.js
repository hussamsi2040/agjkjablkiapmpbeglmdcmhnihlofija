const OpenAI = require('openai');

// Replace with your actual API key
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace this with your actual key

async function testApiKey() {
  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://your-app.com", // Optional but recommended
        "X-Title": "CollegeEssayAI", // Optional but recommended
      },
    });

    console.log('🔑 Testing OpenRouter API key...');
    
    const completion = await openai.chat.completions.create({
      model: "openai/o4-mini", // Using a free model
      messages: [
        { role: "user", content: "Say 'Hello! API key is working correctly.'" }
      ],
      max_tokens: 50,
    });

    console.log('✅ API Key is valid!');
    console.log('Response:', completion.choices[0].message.content);
    console.log('Model used:', completion.model);
    console.log('Usage:', completion.usage);
    
  } catch (error) {
    console.error('❌ API Key test failed:');
    console.error('Error:', error.message);
    
    if (error.status === 401) {
      console.error('\n🔍 Troubleshooting tips:');
      console.error('1. Check if your API key starts with "sk-or-"');
      console.error('2. Verify the key is complete (no missing characters)');
      console.error('3. Make sure your account has credits');
      console.error('4. Check if the key is active in your OpenRouter dashboard');
    }
  }
}

// Instructions
console.log('📋 Instructions:');
console.log('1. Replace "YOUR_API_KEY_HERE" with your actual OpenRouter API key');
console.log('2. Run: node test-api-key.js');
console.log('3. Check the output for success or error messages\n');

testApiKey(); 