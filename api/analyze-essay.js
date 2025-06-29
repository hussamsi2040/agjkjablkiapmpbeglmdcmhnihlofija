import OpenAI from 'openai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, apiKey, model, maxTokens } = req.body;

    // Validate required fields
    if (!prompt || !apiKey || !model || !maxTokens) {
      return res.status(400).json({ 
        error: 'Missing required fields: prompt, apiKey, model, maxTokens' 
      });
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-')) {
      return res.status(400).json({ 
        error: 'Invalid API key format. Must start with "sk-"' 
      });
    }

    // Estimate input tokens (rough approximation: 1 token ≈ 4 characters)
    const estimatedInputTokens = Math.ceil(prompt.length / 4);
    
    if (estimatedInputTokens > 100000) {
      return res.status(400).json({ 
        error: 'Input too large. Please reduce the size of your essay for analysis.' 
      });
    }

    // Initialize OpenAI client with OpenRouter configuration
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": req.headers.origin || "https://college-essay-ai.vercel.app",
        "X-Title": "CollegeEssayAI",
      },
    });

    // Call OpenRouter API using OpenAI SDK
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(maxTokens),
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    // Return success response
    res.status(200).json({ 
      success: true, 
      content: content,
      usage: completion.usage || null
    });

  } catch (error) {
    console.error('Essay analysis error:', error);
    
    // Handle specific OpenAI SDK errors
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenRouter API key.' 
      });
    } else if (error.status === 403) {
      return res.status(403).json({ 
        error: 'Access denied. Your API key doesn\'t have permission to use this model.' 
      });
    } else if (error.status === 413) {
      return res.status(413).json({ 
        error: 'Request too large. Your essay exceeds the model\'s context limit.' 
      });
    } else if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a few minutes and try again.' 
      });
    } else if (error.message) {
      return res.status(500).json({ 
        error: `API Error: ${error.message}` 
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error. Please try again later.' 
      });
    }
  }
} 