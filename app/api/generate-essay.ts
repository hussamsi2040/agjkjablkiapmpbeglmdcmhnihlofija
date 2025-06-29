interface GenerateEssayParams {
  prompt: string;
  wordCount: number;
  tone: string;
  style: string;
  model: string;
  maxTokens: number;
  apiKey: string;
}

export async function generateEssay(params: GenerateEssayParams) {
  const response = await fetch('/api/generate-essay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate essay');
  }

  return response.json();
} 