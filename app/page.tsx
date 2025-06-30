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

interface HistoryItem {
  id: string;
  type: 'generated' | 'analyzed' | 'edited';
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
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai/o4-mini');
  const [maxTokens, setMaxTokens] = useState(2000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState('');
  
  // Essay workflow state
  const [essayData, setEssayData] = useState<EssayData>({
    prompt: '',
    wordCount: 650,
    tone: 'professional',
    style: 'personal narrative'
  });
  const [personalDetails, setPersonalDetails] = useState('');
  const [currentEssay, setCurrentEssay] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [workflowStep, setWorkflowStep] = useState<'input' | 'generated' | 'editing' | 'analysis'>('input');
  
  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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

      setCurrentEssay(result.essay);
      setOriginalPrompt(essayData.prompt);
      setWorkflowStep('generated');
      
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

  const handleEditEssay = async (editInstructions: string) => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!currentEssay.trim()) {
      setError('No essay to edit');
      return;
    }

    if (!editInstructions.trim()) {
      setError('Please provide editing instructions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/edit-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essay: currentEssay,
          instructions: editInstructions,
          model: selectedModel,
          maxTokens,
          apiKey,
          personalDetails: personalDetails.trim() || undefined
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCurrentEssay(result.editedEssay);
        setWorkflowStep('editing');
        
        // Add to history
        addToHistory({
          type: 'edited',
          title: `Edited: ${editInstructions.substring(0, 30)}...`,
          content: result.editedEssay,
          prompt: originalPrompt,
          model: selectedModel
        });
      } else {
        setError(result.error || 'Failed to edit essay');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to edit essay');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeEssay = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!currentEssay.trim()) {
      setError('No essay to analyze');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await analyzeEssay({
        essay: currentEssay,
        prompt: originalPrompt,
        model: selectedModel,
        maxTokens,
        apiKey,
        personalDetails: personalDetails.trim() || undefined
      });

      setWorkflowStep('analysis');
      
      // Add to history
      addToHistory({
        type: 'analyzed',
        title: 'Essay Analysis',
        content: result.analysis,
        prompt: originalPrompt,
        model: selectedModel
      });
    } catch (err: any) {
      setError(err.message || 'Failed to analyze essay');
    } finally {
      setIsLoading(false);
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

  const loadFromHistory = (item: HistoryItem) => {
    setCurrentEssay(item.content);
    setOriginalPrompt(item.prompt || '');
    if (item.type === 'generated') {
      setWorkflowStep('generated');
    } else if (item.type === 'edited') {
      setWorkflowStep('editing');
    } else {
      setWorkflowStep('analysis');
    }
    setShowHistory(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const resetWorkflow = () => {
    setCurrentEssay('');
    setOriginalPrompt('');
    setWorkflowStep('input');
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🎓 CollegeEssayAI</h1>
          <p>Complete essay workflow: Generate → Edit → Analyze → Perfect</p>
          <div className="header-badges">
            <div className="badge">
              <i>✨</i> AI-Powered
            </div>
            <div className="badge">
              <i>🎯</i> One Workflow
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

        <div className="setting-group">
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: '12px 20px',
              background: 'var(--secondary-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              width: '100%'
            }}
          >
            <i>📚</i> {showHistory ? 'Hide' : 'Show'} History ({history.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Workflow Progress */}
        <div className="workflow-progress">
          <div className={`workflow-step ${workflowStep === 'input' ? 'active' : workflowStep !== 'input' ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Input</div>
          </div>
          <div className={`workflow-step ${workflowStep === 'generated' ? 'active' : workflowStep === 'editing' || workflowStep === 'analysis' ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Generate</div>
          </div>
          <div className={`workflow-step ${workflowStep === 'editing' ? 'active' : workflowStep === 'analysis' ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Edit</div>
          </div>
          <div className={`workflow-step ${workflowStep === 'analysis' ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Analyze</div>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="history-panel">
            <h3><i>📚</i> Essay History</h3>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="empty-history">
                  <p>No essays yet. Start by generating your first essay!</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="history-item" onClick={() => loadFromHistory(item)}>
                    <div className="history-item-header">
                      <div className="history-item-info">
                        <h4>{item.title}</h4>
                        <div className="history-item-meta">
                          <span className={`history-type ${item.type}`}>
                            {item.type === 'generated' ? '✍️ Generated' : 
                             item.type === 'edited' ? '✏️ Edited' : '📊 Analyzed'}
                          </span>
                          <span className="history-date">{formatDate(item.timestamp)}</span>
                          <span className="history-model">{item.model}</span>
                        </div>
                      </div>
                    </div>
                    <div className="history-item-preview">
                      {item.content.substring(0, 100)}...
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Input Step */}
        {workflowStep === 'input' && (
          <div className="workflow-content">
            <div className="form-grid">
              <div className="form-section">
                <h3><i>📝</i> Essay Requirements</h3>
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
                    placeholder="Include specific details about yourself: background, experiences, achievements, interests, goals, etc."
                  />
                  <div className="char-counter">
                    {personalDetails.length} characters
                  </div>
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
                <h3><i>🎯</i> Quick Prompts</h3>
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
          </div>
        )}

        {/* Generated/Editing/Analysis Steps */}
        {(workflowStep === 'generated' || workflowStep === 'editing' || workflowStep === 'analysis') && (
          <div className="workflow-content">
            <div className="essay-display">
              <div className="essay-header">
                <h3>
                  <i>📄</i> 
                  {workflowStep === 'generated' ? 'Generated Essay' : 
                   workflowStep === 'editing' ? 'Edited Essay' : 'Essay Analysis'}
                </h3>
                <div className="essay-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => copyToClipboard(currentEssay)}
                  >
                    <i>📋</i> Copy
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => downloadEssay(currentEssay, 'college-essay.txt')}
                  >
                    <i>💾</i> Download
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={resetWorkflow}
                  >
                    <i>🔄</i> New Essay
                  </button>
                </div>
              </div>
              
              <div className="essay-content">
                {currentEssay}
              </div>
            </div>

            <div className="workflow-actions">
              {workflowStep === 'generated' && (
                <div className="action-buttons">
                  <button
                    className="btn btn-primary"
                    onClick={() => setWorkflowStep('editing')}
                  >
                    <i>✏️</i> Edit Essay
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAnalyzeEssay}
                    disabled={isLoading}
                  >
                    <i>📊</i> Analyze Essay
                  </button>
                </div>
              )}

              {workflowStep === 'editing' && (
                <div className="edit-section">
                  <h4><i>✏️</i> Edit Your Essay</h4>
                  <div className="edit-instructions">
                    <h5>Quick Edit Options:</h5>
                    <div className="edit-buttons">
                      {[
                        'Make it more personal and authentic',
                        'Improve the flow and transitions',
                        'Add more specific details and examples',
                        'Make the conclusion stronger',
                        'Adjust the tone to be more confident',
                        'Shorten while maintaining impact'
                      ].map((instruction, index) => (
                        <button
                          key={index}
                          onClick={() => handleEditEssay(instruction)}
                          disabled={isLoading}
                          className="edit-btn"
                        >
                          {instruction}
                        </button>
                      ))}
                    </div>
                    <div className="custom-edit">
                      <textarea
                        placeholder="Or provide your own editing instructions..."
                        id="customEdit"
                        style={{ width: '100%', minHeight: '80px', marginTop: '10px' }}
                      />
                      <button
                        onClick={() => {
                          const customInstruction = (document.getElementById('customEdit') as HTMLTextAreaElement).value;
                          if (customInstruction.trim()) {
                            handleEditEssay(customInstruction);
                          }
                        }}
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{ marginTop: '10px' }}
                      >
                        <i>✏️</i> Apply Custom Edit
                      </button>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="btn btn-primary"
                      onClick={handleAnalyzeEssay}
                      disabled={isLoading}
                    >
                      <i>📊</i> Analyze Essay
                    </button>
                  </div>
                </div>
              )}

              {workflowStep === 'analysis' && (
                <div className="action-buttons">
                  <button
                    className="btn btn-primary"
                    onClick={() => setWorkflowStep('editing')}
                  >
                    <i>✏️</i> Edit Based on Analysis
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={resetWorkflow}
                  >
                    <i>🔄</i> Start New Essay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>Built with ❤️ for college applicants worldwide</p>
          <div className="footer-links">
            <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">Powered by OpenRouter</a>
            <a href="#" onClick={() => setError('Privacy policy coming soon')}>Privacy Policy</a>
            <a href="#" onClick={() => setError('Terms of service coming soon')}>Terms of Service</a>
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