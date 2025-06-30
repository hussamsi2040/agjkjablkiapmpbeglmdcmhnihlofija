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

  // Add state for color tags, project actions, drawer, modals, and carousel
  const colorTags = ['#10a37f', '#3b82f6', '#f59e42', '#e11d48', '#6366f1', '#fbbf24', '#14b8a6'];
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [carouselScroll, setCarouselScroll] = useState(0);

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

  // Add color to each thread/project
  const assignColor = (idx: number) => colorTags[idx % colorTags.length];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f6faff', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 270, background: '#f8fafc', color: '#222', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', boxShadow: '2px 0 8px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: 18, borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={createNewThread} style={{ flex: 1, background: '#10a37f', color: '#fff', border: 'none', borderRadius: 8, padding: 10, cursor: 'pointer', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px #10a37f22' }}>+ New Project</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {threads.map((t, idx) => (
            <div key={t.id} style={{ padding: 12, background: t.id === currentThreadId ? '#e0f7f1' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderRadius: 8, marginBottom: 4, border: t.id === currentThreadId ? '2px solid #10a37f' : '1px solid #e5e7eb' }} onClick={() => switchThread(t.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: 7, background: assignColor(idx), display: 'inline-block' }}></span>
                {renamingId === t.id ? (
                  <input value={renameValue} onChange={e => setRenameValue(e.target.value)} onBlur={() => { setThreads(prev => prev.map(th => th.id === t.id ? { ...th, title: renameValue || th.title } : th)); setRenamingId(null); }} onKeyDown={e => { if (e.key === 'Enter') { setThreads(prev => prev.map(th => th.id === t.id ? { ...th, title: renameValue || th.title } : th)); setRenamingId(null); }}} style={{ borderRadius: 4, border: '1px solid #bbb', background: '#fff', color: '#222', padding: 4, fontSize: 14, width: 90 }} autoFocus />
                ) : (
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90, fontWeight: 600 }} onDoubleClick={e => { e.stopPropagation(); setRenamingId(t.id); setRenameValue(t.title); }}>{t.title}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={e => { e.stopPropagation(); setThreads(prev => [...prev, { ...t, id: Date.now().toString(), title: t.title + ' (Copy)', isActive: false, createdAt: new Date(), updatedAt: new Date() }]); }} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 16 }} title="Duplicate">⧉</button>
                <button onClick={e => { e.stopPropagation(); deleteThread(t.id); }} style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', fontSize: 16 }} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 18, borderTop: '1px solid #e5e7eb', background: '#f1f5f9' }}>
          <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="API Key" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', color: '#222', marginBottom: 10 }} />
          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', color: '#222' }}>
            <option value="openai/o4-mini">O4 Mini</option>
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
            <option value="openai/gpt-4o">GPT-4o</option>
            <option value="anthropic/claude-3-5-sonnet">Claude 3.5</option>
            <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1</option>
          </select>
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: '#3b82f6', cursor: 'pointer' }} onClick={() => window.open('https://collegeessayai.help', '_blank')}>❓ Help</div>
        </div>
      </div>
      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f6faff', position: 'relative' }}>
        {/* Header */}
        <div style={{ padding: '18px 32px', borderBottom: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 18, height: 18, borderRadius: 9, background: assignColor(threads.findIndex(t => t.id === currentThreadId)), display: 'inline-block' }}></span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>{threads.find(t => t.id === currentThreadId)?.title || 'Untitled Project'}</span>
          <button onClick={() => { setRenamingId(currentThreadId); setRenameValue(threads.find(t => t.id === currentThreadId)?.title || ''); }} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 18, marginLeft: 8, cursor: 'pointer' }} title="Rename">✏️</button>
        </div>
        {/* Prompts Carousel */}
        <div style={{ padding: '14px 32px', borderBottom: '1px solid #e5e7eb', background: '#f8fafc', display: 'flex', overflowX: 'auto', gap: 12 }}>
          {premadePrompts.map((p, i) => (
            <button key={i} onClick={() => setInput(p)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: 22, padding: '8px 22px', fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, boxShadow: '0 1px 4px #0369a122' }}>
              {p.startsWith('Write') ? '📝' : p.startsWith('Edit') ? '✏️' : p.startsWith('Analyze') ? '📊' : '💡'} {p}
            </button>
          ))}
        </div>
        {/* Chat Timeline */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32, background: '#f6faff' }}>
          {currentThread?.messages.map((m, idx) => (
            <div key={m.id} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', marginBottom: 24, alignItems: 'flex-end' }}>
              <div style={{ maxWidth: '70%', background: m.role === 'user' ? '#d1fae5' : m.type === 'analyzed' ? '#fef9c3' : '#fff', color: '#222', borderRadius: 18, padding: 18, fontSize: 16, whiteSpace: 'pre-wrap', boxShadow: '0 2px 12px #10a37f11', position: 'relative', border: m.type === 'analyzed' ? '2px solid #fbbf24' : '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#10a37f', marginBottom: 4 }}>{m.role === 'user' ? 'You' : m.type === 'analyzed' ? 'AI Analysis' : 'AI'}</div>
                {m.content}
                <div style={{ fontSize: 11, color: '#888', marginTop: 10, textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <span style={{ marginLeft: 8, color: '#3b82f6' }}>v{idx + 1}</span></div>
                {m.type === 'analyzed' && m.meta && (
                  <div style={{ marginTop: 14, fontSize: 14, background: '#fef3c7', borderRadius: 8, padding: 10, border: '1px solid #fde68a' }}>
                    <div><b>Score:</b> {m.meta.score}/10</div>
                    <div><b>Strengths:</b> <ul>{m.meta.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                    <div><b>Weaknesses:</b> <ul>{m.meta.weaknesses?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                    <div><b>Suggestions:</b> <ul>{m.meta.suggestions?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                  </div>
                )}
                {/* Smart Bubble Actions */}
                {m.role === 'ai' && (m.type === 'generated' || m.type === 'edited') && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                    {editTargetId === m.id ? (
                      <>
                        <input value={editInstruction} onChange={e => setEditInstruction(e.target.value)} placeholder="Edit instructions..." style={{ borderRadius: 8, border: '1px solid #bbb', padding: 8, fontSize: 15, width: 160 }} />
                        <button onClick={async () => { setInput('Edit: ' + editInstruction + '\n' + m.content); setEditTargetId(null); setEditInstruction(''); }} style={{ background: '#fbbf24', color: '#222', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 15, cursor: 'pointer', fontWeight: 600 }}>Send Edit</button>
                        <button onClick={() => { setEditTargetId(null); setEditInstruction(''); }} style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditTargetId(m.id); setEditInstruction(''); }} style={{ background: '#fbbf24', color: '#222', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 15, cursor: 'pointer', fontWeight: 600 }}>✏️ Edit</button>
                        <button onClick={() => setInput('Analyze: ' + m.content)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 15, cursor: 'pointer', fontWeight: 600 }}>📊 Analyze</button>
                        <button onClick={() => { navigator.clipboard.writeText(m.content); }} style={{ background: '#e0e7ef', color: '#222', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 15, cursor: 'pointer' }}>📋 Copy</button>
                        <button onClick={() => { const blob = new Blob([m.content], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'essay.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }} style={{ background: '#e0e7ef', color: '#222', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 15, cursor: 'pointer' }}>⬇️ Download</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
        <div style={{ padding: 24, borderTop: '1px solid #e5e7eb', background: '#fff', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type your essay prompt, edit, or analysis request..." style={{ flex: 1, borderRadius: 12, border: '1px solid #d1d5db', padding: 16, fontSize: 17, resize: 'none', minHeight: 44, maxHeight: 160, background: '#f8fafc', color: '#222', boxShadow: '0 1px 4px #10a37f11' }} disabled={isLoading} />
          <button onClick={handleSend} disabled={isLoading || !input.trim() || !apiKey} style={{ background: '#10a37f', color: '#fff', border: 'none', borderRadius: 12, padding: '0 28px', fontSize: 22, fontWeight: 700, cursor: isLoading || !input.trim() || !apiKey ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #10a37f22' }}>{isLoading ? '...' : '➤'}</button>
          <button onClick={() => setShowDrawer(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, padding: '0 22px', fontSize: 18, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px #3b82f622' }}>Advanced</button>
          <button onClick={() => setShowDetailsModal(true)} style={{ background: '#fbbf24', color: '#222', border: 'none', borderRadius: 12, padding: '0 22px', fontSize: 18, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px #fbbf2422' }}>Attach Details</button>
        </div>
        {error && <div style={{ color: '#e11d48', textAlign: 'center', padding: 10, fontWeight: 600 }}>{error}</div>}
        {/* Advanced Drawer */}
        {showDrawer && (
          <div style={{ position: 'fixed', top: 0, right: 0, width: 370, height: '100vh', background: '#fff', boxShadow: '-4px 0 32px rgba(0,0,0,0.12)', zIndex: 1000, display: 'flex', flexDirection: 'column', padding: 36 }}>
            <h2 style={{ marginBottom: 22, color: '#10a37f', fontWeight: 800, fontSize: 22 }}>Essay Settings</h2>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 700, color: '#222' }}>Personal Details <span style={{ fontSize: 18 }}>🎓🏆🌍</span></label>
              <textarea value={personalDetails} onChange={e => updatePersonalDetails(e.target.value)} style={{ width: '100%', minHeight: 60, borderRadius: 8, border: '1px solid #d1d5db', padding: 10, marginTop: 8, fontSize: 15, background: '#f8fafc' }} placeholder="Add background, experiences, achievements, goals, etc." />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 700, color: '#222' }}>Essay Prompt</label>
              <textarea value={essayData.prompt} onChange={e => setEssayData({ ...essayData, prompt: e.target.value })} style={{ width: '100%', minHeight: 60, borderRadius: 8, border: '1px solid #d1d5db', padding: 10, marginTop: 8, fontSize: 15, background: '#f8fafc' }} placeholder="Essay prompt..." />
              <button onClick={() => setEssayData({ ...essayData, prompt: input })} style={{ marginTop: 8, background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Use current input</button>
            </div>
            <div style={{ marginBottom: 22, display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 700, color: '#222' }}>Word Count</label>
                <select value={essayData.wordCount} onChange={e => setEssayData({ ...essayData, wordCount: Number(e.target.value) })} style={{ width: '100%', borderRadius: 8, border: '1px solid #d1d5db', padding: 8, marginTop: 8, fontSize: 15, background: '#f8fafc' }}>
                  <option value={250}>250</option>
                  <option value={500}>500</option>
                  <option value={650}>650</option>
                  <option value={1000}>1000</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 700, color: '#222' }}>Tone</label>
                <select value={essayData.tone} onChange={e => setEssayData({ ...essayData, tone: e.target.value })} style={{ width: '100%', borderRadius: 8, border: '1px solid #d1d5db', padding: 8, marginTop: 8, fontSize: 15, background: '#f8fafc' }}>
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
                <label style={{ fontWeight: 700, color: '#222' }}>Style</label>
                <select value={essayData.style} onChange={e => setEssayData({ ...essayData, style: e.target.value })} style={{ width: '100%', borderRadius: 8, border: '1px solid #d1d5db', padding: 8, marginTop: 8, fontSize: 15, background: '#f8fafc' }}>
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
            <button onClick={() => setShowDrawer(false)} style={{ background: '#10a37f', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontSize: 18, fontWeight: 700, marginTop: 10, cursor: 'pointer', width: '100%', boxShadow: '0 2px 8px #10a37f22' }}>Apply to Project</button>
          </div>
        )}
        {/* Attach Details Modal */}
        {showDetailsModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowDetailsModal(false)}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 36, minWidth: 320, maxWidth: 420, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ marginBottom: 18, color: '#10a37f', fontWeight: 800, fontSize: 20 }}>Attach Personal Details</h2>
              <textarea value={personalDetails} onChange={e => updatePersonalDetails(e.target.value)} style={{ width: '100%', minHeight: 80, borderRadius: 8, border: '1px solid #d1d5db', padding: 10, marginTop: 8, fontSize: 15, background: '#f8fafc' }} placeholder="Add background, experiences, achievements, goals, etc." />
              <button onClick={() => setShowDetailsModal(false)} style={{ background: '#10a37f', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontSize: 17, fontWeight: 700, marginTop: 18, cursor: 'pointer', width: '100%', boxShadow: '0 2px 8px #10a37f22' }}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 