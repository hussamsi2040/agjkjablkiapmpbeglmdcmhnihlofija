'use client';

import { useState, useEffect, useRef } from 'react';
import { generateEssay } from './api/generate-essay';
import { analyzeEssay } from './api/analyze-essay';

interface EssayData {
  prompt: string;
  wordCount: number;
  tone: string;
  style: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  type: 'input' | 'generated' | 'edited' | 'analyzed' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  meta?: any;
}

interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  isActive: boolean;
  personalDetails?: string;
}

export default function Home() {
  // Core state
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai/o4-mini');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [essayData, setEssayData] = useState<EssayData>({
    prompt: '',
    wordCount: 650,
    tone: 'professional',
    style: 'personal narrative'
  });
  const [personalDetails, setPersonalDetails] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const premadePrompts = [
    'Write a college essay about overcoming a challenge.',
    'Generate a personal statement for a computer science major.',
    'Edit my essay to make it more concise.',
    'Analyze my essay and provide feedback.',
    'Make my essay more personal and authentic.',
    'Write an essay about leadership experience.',
    'Generate a creative introduction for a college essay.',
    'Edit my essay to improve its flow and transitions.'
  ];

  // Load/save threads
  useEffect(() => {
    const savedThreads = localStorage.getItem('essayThreadsUnified');
    if (savedThreads) {
      try {
        const parsed = JSON.parse(savedThreads).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          messages: t.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setThreads(parsed);
        const active = parsed.find((t: Thread) => t.isActive);
        if (active) setCurrentThreadId(active.id);
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('essayThreadsUnified', JSON.stringify(threads));
  }, [threads]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, currentThreadId]);

  // Thread helpers
  const getCurrentThread = () => threads.find(t => t.id === currentThreadId) || null;
  const createNewThread = () => {
    const newThread: Thread = {
      id: Date.now().toString(),
      title: 'New Essay',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      isActive: true,
      personalDetails: ''
    };
    setThreads(prev => prev.map(t => ({ ...t, isActive: false })));
    setThreads(prev => [newThread, ...prev]);
    setCurrentThreadId(newThread.id);
    setEssayData({ prompt: '', wordCount: 650, tone: 'professional', style: 'personal narrative' });
    setPersonalDetails('');
  };
  const switchThread = (id: string) => {
    setThreads(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
    setCurrentThreadId(id);
    const thread = threads.find(t => t.id === id);
    if (thread) {
      setPersonalDetails(thread.personalDetails || '');
    }
  };
  const deleteThread = (id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (currentThreadId === id) {
      const rest = threads.filter(t => t.id !== id);
      setCurrentThreadId(rest[0]?.id || null);
    }
  };
  const addMessage = (msg: ChatMessage) => {
    setThreads(prev => prev.map(t =>
      t.id === currentThreadId
        ? { ...t, updatedAt: new Date(), messages: [...t.messages, msg] }
        : t
    ));
  };
  const updatePersonalDetails = (details: string) => {
    setPersonalDetails(details);
    setThreads(prev => prev.map(t =>
      t.id === currentThreadId ? { ...t, personalDetails: details } : t
    ));
  };

  // Chat/Workflow send handler
  const handleSend = async () => {
    if (!input.trim() || !currentThreadId || !apiKey) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      type: 'input',
      content: input,
      timestamp: new Date()
    };
    addMessage(userMsg);
    setInput('');
    setIsLoading(true);
    try {
      let aiMsg: ChatMessage;
      if (/analyz|grade|feedback/i.test(userMsg.content)) {
        const thread = getCurrentThread();
        const lastEssay = thread?.messages.filter(m => m.type === 'generated' || m.type === 'edited').slice(-1)[0]?.content || '';
        const result = await analyzeEssay({
          essay: lastEssay,
          prompt: essayData.prompt,
          model: selectedModel,
          maxTokens: 2000,
          apiKey,
          personalDetails: personalDetails || undefined
        });
        aiMsg = {
          id: Date.now().toString(),
          role: 'ai',
          type: 'analyzed',
          content: result.analysis,
          timestamp: new Date(),
          model: selectedModel,
          meta: result
        };
      } else if (/edit|revise|improve/i.test(userMsg.content)) {
        const thread = getCurrentThread();
        const lastEssay = thread?.messages.filter(m => m.type === 'generated' || m.type === 'edited').slice(-1)[0]?.content || '';
        const result = await generateEssay({
          prompt: `Edit the following essay: ${userMsg.content}\nEssay:\n${lastEssay}`,
          wordCount: essayData.wordCount,
          tone: essayData.tone,
          style: essayData.style,
          model: selectedModel,
          maxTokens: 2000,
          apiKey,
          personalDetails: personalDetails || undefined
        });
        aiMsg = {
          id: Date.now().toString(),
          role: 'ai',
          type: 'edited',
          content: result.essay,
          timestamp: new Date(),
          model: selectedModel
        };
      } else {
        const result = await generateEssay({
          prompt: userMsg.content,
          wordCount: essayData.wordCount,
          tone: essayData.tone,
          style: essayData.style,
          model: selectedModel,
          maxTokens: 2000,
          apiKey,
          personalDetails: personalDetails || undefined
        });
        aiMsg = {
          id: Date.now().toString(),
          role: 'ai',
          type: 'generated',
          content: result.essay,
          timestamp: new Date(),
          model: selectedModel
        };
      }
      addMessage(aiMsg);
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  // UI
  const currentThread = getCurrentThread();
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7f7f8' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#222', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #333', display: 'flex', gap: 8 }}>
          <button onClick={createNewThread} style={{ flex: 1, background: '#444', color: '#fff', border: 'none', borderRadius: 6, padding: 8, cursor: 'pointer' }}>+ New</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {threads.map(t => (
            <div key={t.id} style={{ padding: 12, background: t.id === currentThreadId ? '#333' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => switchThread(t.id)}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{t.title}</span>
              <button onClick={e => { e.stopPropagation(); deleteThread(t.id); }} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>🗑️</button>
            </div>
          ))}
        </div>
        <div style={{ padding: 16, borderTop: '1px solid #333' }}>
          <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="API Key" style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }} />
          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{ width: '100%', marginTop: 8, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }}>
            <option value="openai/o4-mini">O4 Mini</option>
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
            <option value="openai/gpt-4o">GPT-4o</option>
            <option value="anthropic/claude-3-5-sonnet">Claude 3.5</option>
            <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1</option>
          </select>
        </div>
      </div>
      {/* Main Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
        {/* Advanced Options Panel */}
        <div style={{ padding: 16, borderBottom: '1px solid #eee', background: '#fafafa' }}>
          <button onClick={() => setShowAdvanced(v => !v)} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 15, cursor: 'pointer', marginBottom: 8 }}>
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
          {showAdvanced && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontWeight: 600 }}>Personal Details (optional):</label>
                <textarea value={personalDetails} onChange={e => updatePersonalDetails(e.target.value)} style={{ width: '100%', minHeight: 40, borderRadius: 6, border: '1px solid #ddd', padding: 8, marginTop: 4 }} placeholder="Add background, experiences, achievements, goals, etc." />
              </div>
              <div>
                <label style={{ fontWeight: 600 }}>Essay Prompt:</label>
                <textarea value={essayData.prompt} onChange={e => setEssayData({ ...essayData, prompt: e.target.value })} style={{ width: '100%', minHeight: 40, borderRadius: 6, border: '1px solid #ddd', padding: 8, marginTop: 4 }} placeholder="Essay prompt..." />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600 }}>Word Count:</label>
                  <select value={essayData.wordCount} onChange={e => setEssayData({ ...essayData, wordCount: Number(e.target.value) })} style={{ width: '100%', borderRadius: 6, border: '1px solid #ddd', padding: 6, marginTop: 4 }}>
                    <option value={250}>250</option>
                    <option value={500}>500</option>
                    <option value={650}>650</option>
                    <option value={1000}>1000</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600 }}>Tone:</label>
                  <select value={essayData.tone} onChange={e => setEssayData({ ...essayData, tone: e.target.value })} style={{ width: '100%', borderRadius: 6, border: '1px solid #ddd', padding: 6, marginTop: 4 }}>
                    <option value="professional">Professional</option>
                    <option value="personal">Personal</option>
                    <option value="conversational">Conversational</option>
                    <option value="formal">Formal</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="reflective">Reflective</option>
                    <option value="confident">Confident</option>
                    <option value="humble">Humble</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600 }}>Style:</label>
                  <select value={essayData.style} onChange={e => setEssayData({ ...essayData, style: e.target.value })} style={{ width: '100%', borderRadius: 6, border: '1px solid #ddd', padding: 6, marginTop: 4 }}>
                    <option value="personal narrative">Personal Narrative</option>
                    <option value="analytical">Analytical</option>
                    <option value="descriptive">Descriptive</option>
                    <option value="argumentative">Argumentative</option>
                    <option value="reflective">Reflective</option>
                    <option value="creative">Creative</option>
                    <option value="academic">Academic</option>
                    <option value="storytelling">Storytelling</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {currentThread?.messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', marginBottom: 16 }}>
              <div style={{ maxWidth: '70%', background: m.role === 'user' ? '#10a37f' : m.type === 'analyzed' ? '#f7f3e3' : '#f3f3f3', color: m.role === 'user' ? '#fff' : '#222', borderRadius: 16, padding: 14, fontSize: 15, whiteSpace: 'pre-wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {m.content}
                <div style={{ fontSize: 11, color: m.role === 'user' ? '#c7f5e9' : '#888', marginTop: 8, textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                {m.type === 'analyzed' && m.meta && (
                  <div style={{ marginTop: 12, fontSize: 13 }}>
                    <div><b>Score:</b> {m.meta.score}/10</div>
                    <div><b>Strengths:</b> <ul>{m.meta.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                    <div><b>Weaknesses:</b> <ul>{m.meta.weaknesses?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                    <div><b>Suggestions:</b> <ul>{m.meta.suggestions?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                  </div>
                )}
                {/* Quick Actions for AI essay bubbles */}
                {m.role === 'ai' && (m.type === 'generated' || m.type === 'edited') && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button onClick={() => setInput('Edit: ' + m.content)} style={{ background: '#ffd700', color: '#222', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 14, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => setInput('Analyze: ' + m.content)} style={{ background: '#10a37f', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 14, cursor: 'pointer' }}>Analyze</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ padding: 16, borderTop: '1px solid #eee', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button onClick={() => setShowPrompts(v => !v)} style={{ background: '#10a37f', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 15, cursor: 'pointer' }}>Premade Prompts</button>
          </div>
          {showPrompts && (
            <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, marginBottom: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 12, zIndex: 10 }}>
              {premadePrompts.map((p, i) => (
                <div key={i} style={{ padding: 8, cursor: 'pointer', borderRadius: 4, color: '#222', fontSize: 15, marginBottom: 2, background: '#f7f7f8' }}
                  onClick={() => { setInput(p); setShowPrompts(false); }}
                  onMouseOver={e => (e.currentTarget.style.background = '#e6f7f1')}
                  onMouseOut={e => (e.currentTarget.style.background = '#f7f7f8')}
                >
                  {p}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type your essay prompt, edit, or analysis request..." style={{ flex: 1, borderRadius: 8, border: '1px solid #ddd', padding: 10, fontSize: 15, resize: 'none', minHeight: 36, maxHeight: 120 }} disabled={isLoading} />
            <button onClick={handleSend} disabled={isLoading || !input.trim() || !apiKey} style={{ background: '#10a37f', color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', fontSize: 18, cursor: isLoading || !input.trim() || !apiKey ? 'not-allowed' : 'pointer' }}>{isLoading ? '...' : '➤'}</button>
          </div>
        </div>
        {error && <div style={{ color: 'red', textAlign: 'center', padding: 8 }}>{error}</div>}
      </div>
    </div>
  );
} 