import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const colorTags = ['#10a37f', '#3b82f6', '#f59e42', '#e11d48', '#6366f1', '#fbbf24', '#14b8a6'];
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem('essayThreadsUnified');
      if (saved) {
        try {
          const threads = JSON.parse(saved).map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
            messages: t.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
          }));
          const found = threads.find((t: any) => t.id === id);
          setProject(found || null);
        } catch {}
      }
    }
  }, [id]);

  const assignColor = (idx: number) => colorTags[idx % colorTags.length];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e0f7fa 0%, #f3e8ff 100%)', fontFamily: 'Inter, sans-serif', padding: 0, margin: 0 }}>
      <div style={{ padding: '32px 0 16px 0', textAlign: 'center' }}>
        <button onClick={() => router.push('/')} style={{ position: 'absolute', left: 32, top: 32, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>← Back</button>
        {project ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 10 }}>
              <span style={{ width: 18, height: 18, borderRadius: 9, background: assignColor(0), display: 'inline-block' }}></span>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: '#222', margin: 0 }}>{project.title}</h1>
            </div>
            <div style={{ color: '#6366f1', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{project.messages.length} message{project.messages.length !== 1 ? 's' : ''}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 18 }}>Last updated: {project.updatedAt.toLocaleDateString()} {project.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </>
        ) : (
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#e11d48', marginBottom: 8 }}>Project not found</h1>
        )}
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #6366f122', padding: 36, minHeight: 300, marginTop: 24 }}>
        <div style={{ color: '#bbb', fontSize: 20, textAlign: 'center' }}>
          Essay editor and AI tools coming soon...
        </div>
      </div>
    </div>
  );
} 