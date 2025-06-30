'use client';

import { useState, useEffect, useRef } from 'react';
import { generateEssay } from './api/generate-essay';
import { analyzeEssay } from './api/analyze-essay';

interface ThreadMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ThreadMessage[];
  isActive: boolean;
}

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai/o4-mini');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedThreads = localStorage.getItem('essayThreadsSimple');
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
    localStorage.setItem('essayThreadsSimple', JSON.stringify(threads));
  }, [threads]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, currentThreadId]);

  const getCurrentThread = () => threads.find(t => t.id === currentThreadId) || null;
  const createNewThread = () => {
    const newThread: Thread = {
      id: Date.now().toString(),
      title: 'New Essay',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      isActive: true
    };
    setThreads(prev => prev.map(t => ({ ...t, isActive: false })));
    setThreads(prev => [newThread, ...prev]);
    setCurrentThreadId(newThread.id);
  };
  const switchThread = (id: string) => {
    setThreads(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
    setCurrentThreadId(id);
  };
  const deleteThread = (id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (currentThreadId === id) {
      const rest = threads.filter(t => t.id !== id);
      setCurrentThreadId(rest[0]?.id || null);
    }
  };
  const addMessage = (msg: ThreadMessage) => {
    setThreads(prev => prev.map(t =>
      t.id === currentThreadId
        ? { ...t, updatedAt: new Date(), messages: [...t.messages, msg] }
        : t
    ));
  };
  const handleSend = async () => {
    if (!input.trim() || !currentThreadId || !apiKey) return;
    const userMsg: ThreadMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    addMessage(userMsg);
    setInput('');
    setIsLoading(true);
    try {
      let aiMsg: ThreadMessage;
      if (/analyz|grade|feedback/i.test(userMsg.content)) {
        const thread = getCurrentThread();
        const lastEssay = thread?.messages.filter(m => m.type === 'ai').slice(-1)[0]?.content || '';
        const result = await analyzeEssay({
          essay: lastEssay,
          prompt: '',
          model: selectedModel,
          maxTokens: 2000,
          apiKey
        });
        aiMsg = {
          id: Date.now().toString(),
          type: 'ai',
          content: result.analysis,
          timestamp: new Date()
        };
      } else if (/edit|revise|improve/i.test(userMsg.content)) {
        const thread = getCurrentThread();
        const lastEssay = thread?.messages.filter(m => m.type === 'ai').slice(-1)[0]?.content || '';
        const result = await generateEssay({
          prompt: `Edit the following essay: ${userMsg.content}\nEssay:\n${lastEssay}`,
          wordCount: 650,
          tone: 'professional',
          style: 'personal narrative',
          model: selectedModel,
          maxTokens: 2000,
          apiKey
        });
        aiMsg = {
          id: Date.now().toString(),
          type: 'ai',
          content: result.essay,
          timestamp: new Date()
        };
      } else {
        const result = await generateEssay({
          prompt: userMsg.content,
          wordCount: 650,
          tone: 'professional',
          style: 'personal narrative',
          model: selectedModel,
          maxTokens: 2000,
          apiKey
        });
        aiMsg = {
          id: Date.now().toString(),
          type: 'ai',
          content: result.essay,
          timestamp: new Date()
        };
      }
      addMessage(aiMsg);
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setIsLoading(false);
    }
  };
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
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {currentThread?.messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: m.type === 'user' ? 'row-reverse' : 'row', marginBottom: 16 }}>
              <div style={{ maxWidth: '70%', background: m.type === 'user' ? '#10a37f' : '#f3f3f3', color: m.type === 'user' ? '#fff' : '#222', borderRadius: 16, padding: 14, fontSize: 15, whiteSpace: 'pre-wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {m.content}
                <div style={{ fontSize: 11, color: m.type === 'user' ? '#c7f5e9' : '#888', marginTop: 8, textAlign: m.type === 'user' ? 'right' : 'left' }}>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ padding: 16, borderTop: '1px solid #eee', background: '#fafafa', display: 'flex', gap: 8 }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type your essay prompt, edit, or analysis request..." style={{ flex: 1, borderRadius: 8, border: '1px solid #ddd', padding: 10, fontSize: 15, resize: 'none', minHeight: 36, maxHeight: 120 }} disabled={isLoading} />
          <button onClick={handleSend} disabled={isLoading || !input.trim() || !apiKey} style={{ background: '#10a37f', color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', fontSize: 18, cursor: isLoading || !input.trim() || !apiKey ? 'not-allowed' : 'pointer' }}>{isLoading ? '...' : '➤'}</button>
        </div>
        {error && <div style={{ color: 'red', textAlign: 'center', padding: 8 }}>{error}</div>}
      </div>
    </div>
  );
} 