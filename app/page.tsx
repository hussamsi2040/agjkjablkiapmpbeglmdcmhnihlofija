'use client';

import { useState, useEffect } from 'react';
import { generateEssay } from './api/generate-essay';
import { analyzeEssay } from './api/analyze-essay';

interface EssayData {
  prompt: string;
  wordCount: number;
  tone: string;
  style: string;
}

interface AnalysisData {
  essay: string;
  prompt: string;
}

interface HistoryItem {
  id: string;
  type: 'generated' | 'analyzed';
  title: string;
  content: string;
  prompt?: string;
  timestamp: Date;
  model: string;
  wordCount?: number;
  tone?: string;
  style?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('generate');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai/o4-mini');
  const [maxTokens, setMaxTokens] = useState(2000);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState('');
  
  // Generate tab state
  const [essayData, setEssayData] = useState<EssayData>({
    prompt: '',
    wordCount: 650,
    tone: 'professional',
    style: 'personal narrative'
  });
  const [personalDetails, setPersonalDetails] = useState('');
  const [generatedEssay, setGeneratedEssay] = useState('');
  
  // Analyze tab state
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    essay: '',
    prompt: ''
  });
  const [analysis, setAnalysis] = useState('');

  // History and editing state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEssay, setEditingEssay] = useState('');
  const [editInstructions, setEditInstructions] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('essayHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('essayHistory', JSON.stringify(history));
  }, [history]);

  const models = [
    { value: 'openai/o4-mini', label: 'O4 Mini (Fast & Efficient)', description: 'Best for quick drafts and brainstorming' },
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Balanced)', description: 'Great balance of speed and quality' },
    { value: 'openai/gpt-4o', label: 'GPT-4o (Premium)', description: 'Highest quality for final drafts' },
    { value: 'anthropic/claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', description: 'Excellent for creative writing' },
    { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B', description: 'Strong analytical capabilities' }
  ];

  const tones = [
    'professional',
    'personal',
    'conversational',
    'formal',
    'enthusiastic',
    'reflective',
    'confident',
    'humble'
  ];

  const styles = [
    'personal narrative',
    'analytical',
    'descriptive',
    'argumentative',
    'reflective',
    'creative',
    'academic',
    'storytelling'
  ];

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setHistory(prev => [newItem, ...prev.slice(0, 49)]); // Keep last 50 items
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('essayHistory');
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key first');
      return;
    }

    setIsLoading(true);
    setError('');
    setTestResult('');

    try {
      const response = await fetch('/api/test-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const result = await response.json();

      if (response.ok) {
        setTestResult(`✅ ${result.message}\n\nResponse: ${result.response}`);
      } else {
        setError(`${result.error}\n\nDetails: ${result.details || 'No additional details available'}`);
      }
    } catch (err: any) {
      setError(`Test failed: ${err.message || 'Network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEssay = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!essayData.prompt.trim()) {
      setError('Please enter a prompt for your essay');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedEssay('');

    try {
      const result = await generateEssay({
        prompt: essayData.prompt,
        wordCount: essayData.wordCount,
        tone: essayData.tone,
        style: essayData.style,
        model: selectedModel,
        maxTokens,
        apiKey,
        personalDetails: personalDetails.trim() || undefined
      });

      setGeneratedEssay(result.essay);
      
      // Add to history
      addToHistory({
        type: 'generated',
        title: `Essay: ${essayData.prompt.substring(0, 50)}...`,
        content: result.essay,
        prompt: essayData.prompt,
        model: selectedModel,
        wordCount: essayData.wordCount,
        tone: essayData.tone,
        style: essayData.style
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate essay');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeEssay = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!analysisData.essay.trim()) {
      setError('Please enter an essay to analyze');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysis('');

    try {
      const result = await analyzeEssay({
        essay: analysisData.essay,
        prompt: analysisData.prompt,
        model: selectedModel,
        maxTokens,
        apiKey,
        personalDetails: personalDetails.trim() || undefined
      });

      setAnalysis(result.analysis);
      
      // Add to history
      addToHistory({
        type: 'analyzed',
        title: `Analysis: ${analysisData.essay.substring(0, 50)}...`,
        content: result.analysis,
        prompt: analysisData.prompt,
        model: selectedModel
      });
    } catch (err: any) {
      setError(err.message || 'Failed to analyze essay');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEssay = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!editingEssay.trim()) {
      setError('Please enter an essay to edit');
      return;
    }

    if (!editInstructions.trim()) {
      setError('Please enter editing instructions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await fetch('/api/edit-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essay: editingEssay,
          instructions: editInstructions,
          model: selectedModel,
          maxTokens,
          apiKey,
          personalDetails: personalDetails.trim() || undefined
        }),
      });

      const data = await result.json();

      if (result.ok) {
        setEditingEssay(data.editedEssay);
        
        // Add to history
        addToHistory({
          type: 'generated',
          title: `Edited: ${editInstructions.substring(0, 50)}...`,
          content: data.editedEssay,
          prompt: editInstructions,
          model: selectedModel
        });
        
        setEditInstructions('');
      } else {
        setError(data.error || 'Failed to edit essay');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to edit essay');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    if (item.type === 'generated') {
      setGeneratedEssay(item.content);
      setActiveTab('generate');
      if (item.prompt) {
        setEssayData(prev => ({
          ...prev,
          prompt: item.prompt,
          wordCount: item.wordCount || 650,
          tone: item.tone || 'professional',
          style: item.style || 'personal narrative'
        }));
      }
    } else {
      setAnalysis(item.content);
      setActiveTab('analyze');
      if (item.prompt) {
        setAnalysisData(prev => ({
          ...prev,
          prompt: item.prompt
        }));
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadEssay = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🎓 CollegeEssayAI</h1>
          <p>Transform your college application with AI-powered essay generation and expert analysis</p>
          <div className="header-badges">
            <div className="badge">
              <i>✨</i> AI-Powered
            </div>
            <div className="badge">
              <i>🎯</i> College Focused
            </div>
            <div className="badge">
              <i>⚡</i> Instant Results
            </div>
            <div className="badge">
              <i>🔒</i> Secure
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      <div className="settings-panel">
        <div className="setting-group">
          <label htmlFor="apiKey">OpenRouter API Key</label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
          />
          <small>
            Get your free API key from{' '}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
              OpenRouter
            </a>
          </small>
          <button
            onClick={testApiKey}
            disabled={isLoading || !apiKey.trim()}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: 'var(--accent-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {isLoading ? 'Testing...' : '🔑 Test API Key'}
          </button>
          {testResult && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              background: 'var(--success-gradient)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {testResult}
            </div>
          )}
        </div>

        <div className="setting-group">
          <label htmlFor="model">AI Model</label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
          <small>
            {models.find(m => m.value === selectedModel)?.description}
          </small>
        </div>

        <div className="setting-group">
          <label htmlFor="maxTokens">Max Tokens: {maxTokens}</label>
          <input
            type="range"
            id="maxTokens"
            min="500"
            max="4000"
            step="100"
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
          />
          <small>Controls response length (500-4000 tokens)</small>
        </div>

        <div className="info-box">
          <h4>
            <i>💡</i> Pro Tips
          </h4>
          <ul>
            <li>Use specific prompts for better results</li>
            <li>Include personal details for authenticity</li>
            <li>Try different tones and styles</li>
            <li>Review and edit generated content</li>
            <li>Get your API key from OpenRouter</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            <i>✍️</i> Generate Essay
          </button>
          <button
            className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyze')}
          >
            <i>📊</i> Analyze Essay
          </button>
          <button
            className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <i>✏️</i> Edit with AI
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <i>📚</i> History
          </button>
          <button
            className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <i>❓</i> Help
          </button>
        </div>

        {/* Generate Tab */}
        <div className={`tab-content ${activeTab === 'generate' ? 'active' : ''}`}>
          <div className="form-grid">
            <div className="form-section">
              <h3>
                <i>📝</i> Essay Requirements
              </h3>
              <div className="form-group">
                <label htmlFor="prompt">Essay Prompt</label>
                <textarea
                  id="prompt"
                  value={essayData.prompt}
                  onChange={(e) => setEssayData({ ...essayData, prompt: e.target.value })}
                  placeholder="Describe a challenge, setback, or failure you have faced. How did it affect you, and what did you learn from the experience?"
                />
                <div className="char-counter">
                  {essayData.prompt.length} characters
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="personalDetails">Personal Details (Optional)</label>
                <textarea
                  id="personalDetails"
                  value={personalDetails}
                  onChange={(e) => setPersonalDetails(e.target.value)}
                  placeholder="Include specific details about yourself: background, experiences, achievements, interests, goals, etc. This will help make your essay more personal and authentic."
                />
                <div className="char-counter">
                  {personalDetails.length} characters
                </div>
                <small>Examples: &quot;I&apos;m a first-generation college student from a small town in Texas. I love robotics and have won several science competitions. I want to study engineering to help solve environmental problems.&quot;</small>
              </div>

              <div className="form-group">
                <label htmlFor="wordCount">Target Word Count</label>
                <select
                  id="wordCount"
                  value={essayData.wordCount}
                  onChange={(e) => setEssayData({ ...essayData, wordCount: Number(e.target.value) })}
                >
                  <option value={250}>250 words (Short)</option>
                  <option value={500}>500 words (Medium)</option>
                  <option value={650}>650 words (Common App)</option>
                  <option value={1000}>1000 words (Long)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tone">Writing Tone</label>
                <select
                  id="tone"
                  value={essayData.tone}
                  onChange={(e) => setEssayData({ ...essayData, tone: e.target.value })}
                >
                  {tones.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="style">Writing Style</label>
                <select
                  id="style"
                  value={essayData.style}
                  onChange={(e) => setEssayData({ ...essayData, style: e.target.value })}
                >
                  {styles.map((style) => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>
                <i>🎯</i> Quick Prompts
              </h3>
              <div className="form-group">
                <label>Common App Prompts</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Describe a challenge, setback, or failure you have faced. How did it affect you, and what did you learn from the experience?',
                    'Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.',
                    'Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time.',
                    'Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced.',
                    'Discuss an essay on any topic of your choice. It can be one you have already written, one that responds to a different prompt, or one of your own design.'
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setEssayData({ ...essayData, prompt })}
                      style={{
                        padding: '10px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--bg-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        lineHeight: '1.4'
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button
              className="btn btn-primary"
              onClick={handleGenerateEssay}
              disabled={isLoading}
            >
              <i>🚀</i> Generate Essay
            </button>
            <div className="btn-info">
              <i>⏱️</i> This may take 10-30 seconds depending on the model
            </div>
          </div>

          {generatedEssay && (
            <div className="result-section">
              <h3>
                <i>✨</i> Generated Essay
              </h3>
              <div className="essay-box">{generatedEssay}</div>
              <div className="result-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => copyToClipboard(generatedEssay)}
                >
                  <i>📋</i> Copy to Clipboard
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => downloadEssay(generatedEssay, 'college-essay.txt')}
                >
                  <i>💾</i> Download Essay
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingEssay(generatedEssay);
                    setActiveTab('edit');
                  }}
                >
                  <i>✏️</i> Edit with AI
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analyze Tab */}
        <div className={`tab-content ${activeTab === 'analyze' ? 'active' : ''}`}>
          <div className="form-grid">
            <div className="form-section">
              <h3>
                <i>📄</i> Essay to Analyze
              </h3>
              <div className="form-group">
                <label htmlFor="essayText">Your Essay</label>
                <textarea
                  id="essayText"
                  value={analysisData.essay}
                  onChange={(e) => setAnalysisData({ ...analysisData, essay: e.target.value })}
                  placeholder="Paste your college essay here for analysis..."
                />
                <div className="char-counter">
                  {analysisData.essay.length} characters
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="analysisPrompt">Original Prompt (Optional)</label>
                <textarea
                  id="analysisPrompt"
                  value={analysisData.prompt}
                  onChange={(e) => setAnalysisData({ ...analysisData, prompt: e.target.value })}
                  placeholder="What was the original essay prompt? (helps with analysis)"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>
                <i>📊</i> Analysis Features
              </h3>
              <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <p><strong>🎯 Content Analysis:</strong> Evaluates how well your essay addresses the prompt</p>
                <p><strong>📝 Writing Quality:</strong> Assesses grammar, style, and flow</p>
                <p><strong>💡 Suggestions:</strong> Provides specific improvement recommendations</p>
                <p><strong>⭐ Strengths:</strong> Highlights what works well in your essay</p>
                <p><strong>🔧 Areas for Improvement:</strong> Identifies potential enhancements</p>
                <p><strong>📈 Overall Score:</strong> Gives you a comprehensive rating</p>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button
              className="btn btn-primary"
              onClick={handleAnalyzeEssay}
              disabled={isLoading}
            >
              <i>🔍</i> Analyze Essay
            </button>
            <div className="btn-info">
              <i>⏱️</i> Analysis typically takes 15-45 seconds
            </div>
          </div>

          {analysis && (
            <div className="result-section">
              <h3>
                <i>📊</i> Essay Analysis
              </h3>
              <div className="grade-box">{analysis}</div>
              <div className="result-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => copyToClipboard(analysis)}
                >
                  <i>📋</i> Copy Analysis
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => downloadEssay(analysis, 'essay-analysis.txt')}
                >
                  <i>💾</i> Download Analysis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit with AI Tab */}
        <div className={`tab-content ${activeTab === 'edit' ? 'active' : ''}`}>
          <div className="form-grid">
            <div className="form-section">
              <h3>
                <i>✏️</i> Edit Your Essay
              </h3>
              <div className="form-group">
                <label htmlFor="editingEssay">Essay to Edit</label>
                <textarea
                  id="editingEssay"
                  value={editingEssay}
                  onChange={(e) => setEditingEssay(e.target.value)}
                  placeholder="Paste your essay here to edit with AI assistance..."
                />
                <div className="char-counter">
                  {editingEssay.length} characters
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="editInstructions">Editing Instructions</label>
                <textarea
                  id="editInstructions"
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  placeholder="Tell AI what changes you want: 'Make it more personal', 'Add more details about my robotics experience', 'Improve the conclusion', 'Make it more concise', etc."
                />
                <div className="char-counter">
                  {editInstructions.length} characters
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>
                <i>💡</i> Editing Examples
              </h3>
              <div className="form-group">
                <label>Common Editing Instructions</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Make the essay more personal and authentic',
                    'Add more specific details and examples',
                    'Improve the opening paragraph to be more engaging',
                    'Strengthen the conclusion with better reflection',
                    'Make the writing more concise and focused',
                    'Add more emotional depth and vulnerability',
                    'Improve the flow and transitions between paragraphs',
                    'Make it more specific to my target college/major'
                  ].map((instruction, index) => (
                    <button
                      key={index}
                      onClick={() => setEditInstructions(instruction)}
                      style={{
                        padding: '10px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        background: 'var(--bg-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px',
                        lineHeight: '1.4'
                      }}
                    >
                      {instruction}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button
              className="btn btn-primary"
              onClick={handleEditEssay}
              disabled={isLoading}
            >
              <i>✨</i> Edit with AI
            </button>
            <div className="btn-info">
              <i>⏱️</i> Editing typically takes 15-30 seconds
            </div>
          </div>

          {editingEssay && editInstructions && (
            <div className="result-section">
              <h3>
                <i>✏️</i> Edited Essay
              </h3>
              <div className="essay-box">{editingEssay}</div>
              <div className="result-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => copyToClipboard(editingEssay)}
                >
                  <i>📋</i> Copy to Clipboard
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => downloadEssay(editingEssay, 'edited-essay.txt')}
                >
                  <i>💾</i> Download Essay
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setGeneratedEssay(editingEssay);
                    setActiveTab('generate');
                  }}
                >
                  <i>🔄</i> Continue Editing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History Tab */}
        <div className={`tab-content ${activeTab === 'history' ? 'active' : ''}`}>
          <div className="history-header">
            <h3>
              <i>📚</i> Essay History
            </h3>
            <div className="history-actions">
              <button
                className="btn btn-secondary"
                onClick={clearHistory}
                disabled={history.length === 0}
              >
                <i>🗑️</i> Clear All
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="empty-history">
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
                <h4>No History Yet</h4>
                <p>Your generated essays and analyses will appear here for easy access.</p>
              </div>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-item-header">
                    <div className="history-item-info">
                      <h4>{item.title}</h4>
                      <div className="history-item-meta">
                        <span className={`history-type ${item.type}`}>
                          {item.type === 'generated' ? '✍️ Generated' : '📊 Analyzed'}
                        </span>
                        <span className="history-date">{formatDate(item.timestamp)}</span>
                        <span className="history-model">{item.model}</span>
                      </div>
                    </div>
                    <div className="history-item-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => loadFromHistory(item)}
                      >
                        <i>📖</i> Load
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => copyToClipboard(item.content)}
                      >
                        <i>📋</i> Copy
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => deleteFromHistory(item.id)}
                      >
                        <i>🗑️</i> Delete
                      </button>
                    </div>
                  </div>
                  <div className="history-item-preview">
                    {item.content.substring(0, 200)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Tab */}
        <div className={`tab-content ${activeTab === 'help' ? 'active' : ''}`}>
          <div className="help-content">
            <h4>
              <i>🎓</i> About CollegeEssayAI
            </h4>
            <p>
              CollegeEssayAI is an advanced tool designed specifically for college admission essays. 
              It uses state-of-the-art AI models to help you create compelling, authentic essays that 
              showcase your unique voice and experiences.
            </p>

            <h4>
              <i>🔑</i> Getting Your API Key
            </h4>
            <ul>
              <li>Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">OpenRouter</a></li>
              <li>Sign up for a free account</li>
              <li>Navigate to the API Keys section</li>
              <li>Create a new API key</li>
              <li>Copy and paste it into the app</li>
            </ul>

            <h4>
              <i>💡</i> Writing Tips
            </h4>
            <ul>
              <li>Be specific and personal in your prompts</li>
              <li>Include relevant details about your experiences</li>
              <li>Mention the college or program you&apos;re applying to</li>
              <li>Specify any particular requirements or constraints</li>
              <li>Always review and edit generated content</li>
            </ul>

            <h4>
              <i>✏️</i> AI Editing Features
            </h4>
            <ul>
              <li>Use specific editing instructions for better results</li>
              <li>Try different approaches: &quot;make it more personal&quot;, &quot;add details&quot;, etc.</li>
              <li>Iterate on your essays with multiple edits</li>
              <li>Combine generated and edited content for best results</li>
            </ul>

            <h4>
              <i>📚</i> History Features
            </h4>
            <ul>
              <li>All your essays and analyses are automatically saved</li>
              <li>Load previous work to continue editing</li>
              <li>Compare different versions of your essays</li>
              <li>Export your work anytime</li>
            </ul>

            <h4>
              <i>⚙️</i> Model Selection
            </h4>
            <ul>
              <li><strong>O4 Mini:</strong> Fastest, great for brainstorming</li>
              <li><strong>GPT-4o Mini:</strong> Balanced speed and quality</li>
              <li><strong>GPT-4o:</strong> Highest quality, best for final drafts</li>
              <li><strong>Claude 3.5 Sonnet:</strong> Excellent for creative writing</li>
              <li><strong>Llama 3.1 70B:</strong> Strong analytical capabilities</li>
            </ul>

            <h4>
              <i>🔒</i> Privacy & Security
            </h4>
            <ul>
              <li>Your API key is stored locally in your browser</li>
              <li>Essays are processed securely through OpenRouter</li>
              <li>No data is stored on our servers</li>
              <li>You can clear your data by refreshing the page</li>
            </ul>

            <h4>
              <i>❓</i> Troubleshooting
            </h4>
            <ul>
              <li>Ensure your API key is correct and active</li>
              <li>Check your internet connection</li>
              <li>Try a different AI model if one fails</li>
              <li>Reduce max tokens if you get timeout errors</li>
              <li>Make sure your prompt is clear and specific</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>Built with ❤️ for college applicants worldwide</p>
          <div className="footer-links">
            <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">Powered by OpenRouter</a>
            <a href="#" onClick={() => setShowHelp(true)}>Privacy Policy</a>
            <a href="#" onClick={() => setShowHelp(true)}>Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Processing your request...</h3>
            <p>This may take a few moments depending on the model and complexity.</p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {error && (
        <div className="modal" onClick={() => setError('')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setError('')}>&times;</span>
            <h3>
              <i>⚠️</i> Error
            </h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{error}</p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setError('')}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 