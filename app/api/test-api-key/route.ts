import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
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

    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: 'openai/o4-mini',
      messages: [
        {
          role: 'user',
          content: 'Hello! Please respond with "API key is working correctly!"'
        }
      ],
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content?.trim();

    if (response) {
      return NextResponse.json({ 
        success: true, 
        message: 'API key is valid and working!',
        response: response
      });
    } else {
      return NextResponse.json(
        { error: 'API key test failed - no response received' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('API key test error:', error);

    // Handle specific API errors
    if (error.status === 401) {
      return NextResponse.json(
        { 
          error: 'Invalid API key. Please check your OpenRouter API key.',
          details: 'Make sure you copied the full key starting with "sk-or-v1-"'
        },
        { status: 401 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again in a few minutes.',
          details: 'You may have reached your OpenRouter usage limits'
        },
        { status: 429 }
      );
    }

    if (error.status === 400) {
      return NextResponse.json(
        { 
          error: 'Invalid request format.',
          details: error.message || 'Please check your API key format'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'API key test failed.',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 