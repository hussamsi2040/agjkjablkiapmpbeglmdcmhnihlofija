import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { essay, prompt, model, maxTokens, apiKey, personalDetails } = body;

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
    const systemPrompt = `You are an expert college admissions counselor with decades of experience evaluating personal statements. Your role is to provide comprehensive, constructive feedback on college admission essays.

Provide your analysis in the following structured format:

**Overall Assessment (1-10 scale)**
[Give a score and brief explanation]

**Content Analysis**
- Prompt Response: [How well does it address the prompt?]
- Personal Voice: [Is the author's unique voice present?]
- Authenticity: [Does it feel genuine and personal?]
${personalDetails ? `- Personal Details Integration: [How well are personal details incorporated?]` : ''}

**Writing Quality**
- Grammar & Mechanics: [Assessment of technical writing]
- Flow & Structure: [How well does it read?]
- Clarity: [Is the message clear and compelling?]

**Strengths**
[List 3-4 specific strengths with examples]

**Areas for Improvement**
[List 3-4 specific suggestions with examples]

**Specific Recommendations**
[Provide actionable advice for revision]

**Final Thoughts**
[Encouraging summary with next steps]

Be constructive, specific, and encouraging. Focus on actionable feedback that will help improve the essay.`;

    // Create the user prompt
    const userPrompt = `Please analyze this college admission essay:

${prompt ? `Original Prompt: "${prompt}"` : 'No specific prompt provided'}
${personalDetails ? `Personal Details to Consider: ${personalDetails}` : ''}

Essay:
"${essay}"

Please provide a comprehensive analysis following the structured format outlined above.`;

    // Generate the analysis
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    });

    const analysis = completion.choices[0]?.message?.content?.trim();

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to analyze essay' },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error('Essay analysis error:', error);

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
      { error: 'Failed to analyze essay. Please try again.' },
      { status: 500 }
    );
  }
} 