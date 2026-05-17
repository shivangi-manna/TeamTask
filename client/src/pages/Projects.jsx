import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Modal from '../components/Modal';

const COLORS = ['#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#6366f1'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#8b5cf6' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = () => {
    api.get('/projects').then(r => setProjects(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(fetchProjects, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects', form);
      setShowModal(false);
      setForm({ name: '', description: '', color: '#8b5cf6' });
      fetchProjects();
    } catch (err) { alert(err.response?.data?.detail || 'Error'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <>
      <div className="topbar">
        <h2>Projects Workspace</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Project
          </button>
        </div>
      </div>
      <div className="page-content fade-in">
        <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Your Projects</h1>
            <p>Create, manage, and collaborate on team project boards.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Projects</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{projects.length}</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Completed Tasks</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>{projects.reduce((acc, p) => acc + p.completed_count, 0)}</div>
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state" style={{ maxWidth: 600, margin: '4rem auto' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1.5rem', color: 'var(--accent-indigo)' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            <h3>No project boards created yet</h3>
            <p style={{ marginBottom: '2rem' }}>Get your team aligned by creating your very first project board.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create Project Board
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((p, i) => {
              const progress = p.task_count > 0 ? Math.round((p.completed_count / p.task_count) * 100) : 0;
              return (
                <div key={p.id} className="project-card slide-up" style={{ '--project-color': p.color, animationDelay: `${i * 0.05}s` }} onClick={() => navigate(`/projects/${p.id}`)}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3 }}>{p.name}</h3>
                      <span style={{ width: 14, height: 14, borderRadius: '50%', background: p.color, flexShrink: 0, boxShadow: `0 0 12px ${p.color}` }}></span>
                    </div>
                    <p>{p.description || 'No description provided for this project workspace.'}</p>
                  </div>
                  
                  <div>
                    <div className="project-meta" style={{ marginBottom: '1.25rem' }}>
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        {p.member_count} Members
                      </span>
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        {p.task_count} Tasks
                      </span>
                      <span style={{ color: p.completed_count > 0 ? 'var(--accent-green)' : 'inherit' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        {p.completed_count} Done
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 0 }}>
                      <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${p.color}, var(--accent-cyan))` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
          <Modal title="Create Project Workspace" onClose={() => setShowModal(false)}>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Project Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Alpha Redesign, Q3 Launch" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What are the goals and objectives of this project workspace?" />
              </div>
              <div className="form-group">
                <label>Theme Accent</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {COLORS.map(c => (
                    <button type="button" key={c} onClick={() => setForm({ ...form, color: c })}
                      style={{ width: 36, height: 36, borderRadius: '50%', background: c, border: form.color === c ? '3px solid white' : '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s', boxShadow: form.color === c ? `0 0 15px ${c}` : 'none', transform: form.color === c ? 'scale(1.1)' : 'scale(1)' }}
                    />
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Initialize Workspace'}</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </>
  );
}
