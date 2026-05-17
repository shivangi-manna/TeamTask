import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = { TODO: '#06b6d4', IN_PROGRESS: '#f59e0b', IN_REVIEW: '#c084fc', DONE: '#10b981' };
const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([api.get('/dashboard/stats'), api.get('/dashboard/my-tasks')])
      .then(([s, t]) => { setStats(s.data); setMyTasks(t.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  const chartData = stats ? Object.entries(stats.status_distribution)
    .map(([key, val]) => ({ name: STATUS_LABELS[key] || key, value: val, color: STATUS_COLORS[key] || '#64748b' }))
    .filter(d => d.value > 0) : [];

  const isOverdue = (d) => d && new Date(d) < new Date();

  return (
    <>
      <div className="topbar">
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ⚡ Workflow Active
          </div>
        </div>
      </div>
      <div className="page-content fade-in">
        <div className="page-header">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Team'}! 👋</h1>
          <p>Here is your team's real-time workflow and project analytics.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card slide-up">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-indigo-light)', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div className="stat-info">
              <h3>{stats?.total_projects || 0}</h3>
              <p>Active Projects</p>
            </div>
          </div>
          <div className="stat-card slide-up" style={{ animationDelay: '0.05s' }}>
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div className="stat-info">
              <h3>{stats?.total_tasks || 0}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          <div className="stat-card slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="stat-info">
              <h3>{stats?.completion_rate || 0}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>
          <div className="stat-card slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className="stat-info">
              <h3>{stats?.overdue_tasks || 0}</h3>
              <p>Overdue Tasks</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.75rem' }}>
          <div className="card slide-up" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Status Distribution</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)' }}>Analytics</span>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={105} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="rgba(16,22,38,0.8)" strokeWidth={3} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(16, 22, 38, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#f1f5f9', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="empty-state"><p>No tasks available for distribution</p></div>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {chartData.map(d => (
                <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: d.color, display: 'inline-block', boxShadow: `0 0 10px ${d.color}` }}></span>
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>

          <div className="card slide-up" style={{ animationDelay: '0.25s', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>My Assigned Tasks</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.15)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>{myTasks.length} Active</span>
            </div>
            {myTasks.length === 0 ? (
              <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <h3>All caught up!</h3>
                <p>No tasks are currently assigned to you.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 360, overflowY: 'auto', paddingRight: '0.5rem', flex: 1 }}>
                {myTasks.map(task => (
                  <div key={task.id} className="task-card" style={{ padding: '1.15rem 1.25rem', borderLeft: `4px solid ${STATUS_COLORS[task.status] || 'var(--accent-indigo)'}` }} onClick={() => navigate(`/projects/${task.project_id}`)}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{task.title}</h4>
                      <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>{STATUS_LABELS[task.status]}</span>
                    </div>
                    <div className="task-card-meta" style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        Project #{task.project_id}
                      </span>
                      {task.due_date && (
                        <span className={`due-date ${isOverdue(task.due_date) && task.status !== 'DONE' ? 'overdue' : ''}`}>
                          📅 {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
