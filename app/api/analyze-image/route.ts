import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, prompt, wordCount, tone, style, model, maxTokens, apiKey, personalDetails } = body;

    // Validate required fields
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI client with OpenRouter
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://college-essay-ai.vercel.app',
        'X-Title': 'CollegeEssayAI',
      },
    });

    // Create the system prompt for image analysis
    const systemPrompt = `You are an expert college admissions counselor and essay writer. Your task is to analyze an image and create a compelling college admission essay based on it.

For the analysis, provide:
1. **Image Description**: What you see in the image
2. **Potential Essay Themes**: How this image could relate to college admission topics
3. **Personal Connection Ideas**: Ways a student might connect this to their experiences
4. **Writing Suggestions**: How to approach writing about this image

For the essay, create a ${tone} tone with ${style} style, targeting ${wordCount} words. Focus on:
- Personal experiences and growth
- Authentic voice and storytelling
- College admission relevance
- Strong narrative structure
${personalDetails ? `- Incorporate these personal details: ${personalDetails}` : ''}

Important: Provide both analysis and essay in your response.`;

    // Create the user prompt
    const userPrompt = `Please analyze this image and create a college admission essay:

${prompt ? `Additional Context: ${prompt}` : ''}
${personalDetails ? `Personal Details to Incorporate: ${personalDetails}` : ''}

Requirements:
- Tone: ${tone}
- Style: ${style}
- Target length: ${wordCount} words
- Focus on personal experience and growth
- Be authentic and engaging

Please provide both an analysis of the image and a complete essay based on it.`;

    // Create the messages array with image
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      {
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: userPrompt
          },
          {
            type: 'image_url' as const,
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ];

    // Generate the analysis and essay
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content?.trim();

    if (!response) {
      return NextResponse.json(
        { error: 'Failed to analyze image' },
        { status: 500 }
      );
    }

    // Split the response into analysis and essay
    const parts = response.split(/\*\*Generated Essay\*\*|\*\*Essay\*\*|\*\*College Essay\*\*/);
    
    let analysis = '';
    let essay = '';

    if (parts.length >= 2) {
      analysis = parts[0].trim();
      essay = parts[1].trim();
    } else {
      // If we can't split, treat the whole response as the essay
      essay = response;
      analysis = 'Image analysis completed successfully.';
    }

    return NextResponse.json({ 
      analysis,
      essay 
    });

  } catch (error: any) {
    console.error('Image analysis error:', error);

    // Handle specific API errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your OpenRouter API key.' },
        { status: 401 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    if (error.status === 400) {
      return NextResponse.json(
        { error: 'Invalid request. Please check your input and try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    );
  }
} 