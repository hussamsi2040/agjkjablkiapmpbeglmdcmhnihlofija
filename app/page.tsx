'use client';

import { useState, useEffect, useRef } from 'react';
import { generateEssay } from './api/generate-essay';
import { analyzeEssay } from './api/analyze-essay';
import Link from 'next/link';

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e0f7fa 0%, #f3e8ff 100%)', fontFamily: 'Inter, sans-serif', padding: 0, margin: 0 }}>
      <header style={{ padding: '32px 0 16px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1, color: '#222', marginBottom: 8 }}>EssayCraft</h1>
        <div style={{ fontSize: 18, color: '#6366f1', fontWeight: 500 }}>Your Creative College Essay Studio</div>
      </header>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
          <button onClick={createNewThread} style={{ background: 'linear-gradient(90deg, #10a37f 60%, #3b82f6 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 36px', fontSize: 20, fontWeight: 700, boxShadow: '0 4px 24px #10a37f22', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>+ Start New Essay</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {threads.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: 22, padding: 60 }}>No essays yet. Click &quot;Start New Essay&quot; to begin!</div>
          ) : (
            threads.map((t, idx) => (
              <Link key={t.id} href={`/studio/${t.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #6366f122', padding: 28, position: 'relative', border: '2px solid #e0e7ef', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ width: 18, height: 18, borderRadius: 9, background: assignColor(idx), display: 'inline-block' }}></span>
                    <span style={{ fontWeight: 700, fontSize: 20, color: '#222', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
                  </div>
                  <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{t.messages.length} message{t.messages.length !== 1 ? 's' : ''}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>Last updated: {t.updatedAt.toLocaleDateString()} {t.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 