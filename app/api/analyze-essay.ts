interface AnalyzeEssayParams {
  essay: string;
  prompt: string;
  model: string;
  maxTokens: number;
  apiKey: string;
}

export async function analyzeEssay(params: AnalyzeEssayParams) {
  const response = await fetch('/api/analyze-essay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze essay');
  }

  return response.json();
} 