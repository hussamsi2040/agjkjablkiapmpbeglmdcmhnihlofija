import OpenAI from 'openai';

// Test configuration
const API_KEY = "sk-your-actual-api-key-here"; // CHANGE THIS!
const SITE_URL = "https://college-essay-ai.vercel.app";
const SITE_NAME = "CollegeEssayAI";

async function testOpenRouterWithSDK() {
  console.log("🚀 Testing OpenRouter with OpenAI SDK...");
  console.log("=" * 60);
  
  if (API_KEY === "sk-your-actual-api-key-here") {
    console.log("❌ Please update the API_KEY variable with your actual OpenRouter API key!");
    console.log("💡 Get your key from: https://openrouter.ai/keys");
    return;
  }

  try {
    // Initialize OpenAI client with OpenRouter configuration
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: API_KEY,
      defaultHeaders: {
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
      },
    });

    console.log("✅ OpenAI client initialized with OpenRouter");
    console.log(`🔗 Base URL: https://openrouter.ai/api/v1`);
    console.log(`🌐 Site URL: ${SITE_URL}`);
    console.log(`📝 Site Name: ${SITE_NAME}`);
    console.log("-" * 60);

    // Test 1: Simple text completion
    console.log("📝 Test 1: Simple text completion...");
    const textCompletion = await openai.chat.completions.create({
      model: "openai/o4-mini",
      messages: [
        {
          role: "user",
          content: "Say 'Hello, OpenAI SDK with OpenRouter is working!'"
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    console.log("✅ Text completion successful!");
    console.log(`📄 Response: ${textCompletion.choices[0].message.content}`);
    console.log(`💰 Usage: ${JSON.stringify(textCompletion.usage)}`);
    console.log("-" * 60);

    // Test 2: Image analysis (if model supports it)
    console.log("🖼️ Test 2: Image analysis...");
    const imageCompletion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // This model supports images
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What is in this image? Describe it briefly."
            },
            {
              type: "image_url",
              image_url: {
                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
              }
            }
          ]
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    console.log("✅ Image analysis successful!");
    console.log(`📄 Response: ${imageCompletion.choices[0].message.content}`);
    console.log(`💰 Usage: ${JSON.stringify(imageCompletion.usage)}`);
    console.log("-" * 60);

    // Test 3: College essay generation
    console.log("🎓 Test 3: College essay generation...");
    const essayPrompt = `Write a brief college admission essay (100 words) about overcoming a challenge. Make it personal and authentic.`;
    
    const essayCompletion = await openai.chat.completions.create({
      model: "openai/o4-mini",
      messages: [
        {
          role: "user",
          content: essayPrompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    console.log("✅ Essay generation successful!");
    console.log(`📄 Response: ${essayCompletion.choices[0].message.content}`);
    console.log(`💰 Usage: ${JSON.stringify(essayCompletion.usage)}`);
    console.log("-" * 60);

    // Test 4: Different models
    console.log("🤖 Test 4: Testing different models...");
    const models = [
      "openai/o4-mini",
      "openai/gpt-4o-mini", 
      "anthropic/claude-3-5-sonnet-20241022"
    ];

    for (const model of models) {
      try {
        console.log(`Testing model: ${model}...`);
        const modelTest = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: "user",
              content: "Say 'Hello' in one word."
            }
          ],
          max_tokens: 10,
          temperature: 0.1,
        });

        console.log(`✅ ${model}: ${modelTest.choices[0].message.content}`);
      } catch (error) {
        console.log(`❌ ${model}: ${error.message}`);
      }
    }

    console.log("=" * 60);
    console.log("🎉 All tests completed successfully!");
    console.log("✅ Your OpenAI SDK + OpenRouter setup is working perfectly!");
    console.log("🚀 You can now deploy your CollegeEssayAI app to Vercel!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    
    if (error.status === 401) {
      console.log("\n💡 401 Error Solutions:");
      console.log("   - Get a new API key from https://openrouter.ai/keys");
      console.log("   - Make sure you have credits in your account");
      console.log("   - Check that the key starts with 'sk-'");
    } else if (error.status === 403) {
      console.log("\n💡 403 Error Solutions:");
      console.log("   - Try a different model");
      console.log("   - Check your account permissions");
    } else if (error.status === 429) {
      console.log("\n💡 429 Error Solutions:");
      console.log("   - Wait a few minutes and try again");
      console.log("   - Check your rate limits");
    } else {
      console.log("\n💡 General Error Solutions:");
      console.log("   - Check your internet connection");
      console.log("   - Verify your API key is correct");
      console.log("   - Try again in a few minutes");
    }
  }
}

// Run the test
testOpenRouterWithSDK(); 