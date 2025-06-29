import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, wordCount, tone, style, model, maxTokens, apiKey } = body;

    // Validate required fields
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Essay prompt is required' },
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

    // Create the system prompt
    const systemPrompt = `You are an expert college admissions essay writer with years of experience helping students craft compelling personal statements. Your goal is to create authentic, engaging essays that showcase the student's unique voice and experiences.

Key Guidelines:
- Write in a ${tone} tone with a ${style} style
- Target approximately ${wordCount} words
- Focus on personal experiences and growth
- Show, don't just tell
- Be authentic and avoid clichés
- Use vivid, specific details
- Create a strong narrative arc
- End with reflection or insight
- Ensure excellent grammar and flow

Important: Write the essay directly without any meta-commentary or explanations. The response should be the essay itself.`;

    // Create the user prompt
    const userPrompt = `Write a college admission essay based on this prompt:

"${prompt}"

Requirements:
- Tone: ${tone}
- Style: ${style}
- Target length: ${wordCount} words
- Focus on personal experience and growth
- Be authentic and engaging`;

    // Generate the essay
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    });

    const essay = completion.choices[0]?.message?.content?.trim();

    if (!essay) {
      return NextResponse.json(
        { error: 'Failed to generate essay' },
        { status: 500 }
      );
    }

    return NextResponse.json({ essay });

  } catch (error: any) {
    console.error('Essay generation error:', error);

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
      { error: 'Failed to generate essay. Please try again.' },
      { status: 500 }
    );
  }
} 