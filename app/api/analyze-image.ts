interface AnalyzeImageParams {
  imageUrl: string;
  prompt: string;
  wordCount: number;
  tone: string;
  style: string;
  model: string;
  maxTokens: number;
  apiKey: string;
  personalDetails?: string;
}

export async function analyzeImage(params: AnalyzeImageParams) {
  const response = await fetch('/api/analyze-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze image');
  }

  return response.json();
} 