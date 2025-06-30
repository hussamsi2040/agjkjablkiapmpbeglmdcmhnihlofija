import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { essay, instructions, model, maxTokens, apiKey, personalDetails } = body;

    // Validate required fields
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!essay) {
      return NextResponse.json(
        { error: 'Essay content is required' },
        { status: 400 }
      );
    }

    if (!instructions) {
      return NextResponse.json(
        { error: 'Editing instructions are required' },
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

    // Create the system prompt for editing
    const systemPrompt = `You are an expert college admissions essay editor with years of experience helping students improve their personal statements. Your goal is to enhance the essay based on the user's specific instructions while maintaining the student's authentic voice and original message.

Key Guidelines:
- Follow the user's editing instructions precisely
- Maintain the original tone and style unless specifically asked to change
- Preserve the student's authentic voice and personal experiences
- Improve clarity, flow, and impact
- Keep the same general structure unless asked to reorganize
- Ensure excellent grammar and flow
- Make the essay more engaging and compelling

${personalDetails ? `Personal Details to Consider: ${personalDetails}` : ''}

Important: Return only the edited essay without any meta-commentary or explanations. The response should be the improved essay itself.`;

    // Create the user prompt for editing
    const userPrompt = `Please edit the following college essay based on these instructions:

Editing Instructions: "${instructions}"

Original Essay:
"${essay}"

Please provide the edited version of the essay that incorporates the requested changes while maintaining the student's authentic voice and original message.`;

    // Generate the edited essay
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

    const editedEssay = completion.choices[0]?.message?.content?.trim();

    if (!editedEssay) {
      return NextResponse.json(
        { error: 'Failed to edit essay' },
        { status: 500 }
      );
    }

    return NextResponse.json({ editedEssay });

  } catch (error: any) {
    console.error('Essay editing error:', error);

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
      { error: 'Failed to edit essay. Please try again.' },
      { status: 500 }
    );
  }
} 