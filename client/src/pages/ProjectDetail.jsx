import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done' };
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', assignee_id: '', due_date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const fetchData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(pRes.data);
      setTasks(tRes.data);
      const myMembership = pRes.data.members?.find(m => m.user.id === user?.id);
      setUserRole(myMembership?.role || null);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 404) navigate('/projects');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...taskForm };
      if (!payload.assignee_id) delete payload.assignee_id;
      if (!payload.due_date) delete payload.due_date;
      else payload.due_date = new Date(payload.due_date).toISOString();
      await api.post(`/projects/${id}/tasks`, payload);
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', assignee_id: '', due_date: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.detail || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/projects/${id}/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) { alert(err.response?.data?.detail || 'Error'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to permanently delete this task?')) return;
    try {
      await api.delete(`/projects/${id}/tasks/${taskId}`);
      fetchData();
    } catch (err) { alert(err.response?.data?.detail || 'Error'); }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...taskForm };
      if (!payload.assignee_id) payload.assignee_id = null;
      if (!payload.due_date) payload.due_date = null;
      else payload.due_date = new Date(payload.due_date).toISOString();
      await api.put(`/projects/${id}/tasks/${editingTask}`, payload);
      setEditingTask(null);
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', assignee_id: '', due_date: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.detail || 'Error'); }
    finally { setSubmitting(false); }
  };

  const openEditTask = (task) => {
    setEditingTask(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      assignee_id: task.assignee_id || '',
      due_date: task.due_date ? task.due_date.slice(0, 16) : '',
    });
    setShowTaskModal(true);
  };

  const isOverdue = (d) => d && new Date(d) < new Date();
  const isAdmin = userRole === 'ADMIN';

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!project) return null;

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/projects')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back
          </button>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.4rem' }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: project.color, display: 'inline-block', boxShadow: `0 0 15px ${project.color}` }}></span>
            {project.name}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isAdmin && (
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/projects/${id}/team`)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Manage Team ({project.member_count})
            </button>
          )}
          {isAdmin && (
            <button className="btn btn-primary btn-sm" onClick={() => { setEditingTask(null); setTaskForm({ title: '', description: '', priority: 'MEDIUM', assignee_id: '', due_date: '' }); setShowTaskModal(true); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Task
            </button>
          )}
        </div>
      </div>
      <div className="page-content fade-in">
        {project.description && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem 1.75rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{project.description}</p>
          </div>
        )}

        <div className="kanban-board">
          {STATUSES.map(status => {
            const colTasks = tasks.filter(t => t.status === status);
            return (
              <div key={status} className="kanban-column">
                <div className="kanban-column-header">
                  <span style={{ color: 'white' }}>{STATUS_LABELS[status]}</span>
                  <span className="count">{colTasks.length}</span>
                </div>
                {colTasks.map(task => (
                  <div key={task.id} className="task-card" style={{ borderLeft: `4px solid ${task.priority === 'URGENT' ? '#e11d48' : task.priority === 'HIGH' ? '#f43f5e' : task.priority === 'MEDIUM' ? '#f59e0b' : '#06b6d4'}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <h4>{task.title}</h4>
                    </div>
                    {task.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>{task.description}</p>}
                    <div className="task-card-meta">
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                      {task.due_date && (
                        <span className={`due-date ${isOverdue(task.due_date) && task.status !== 'DONE' ? 'overdue' : ''}`}>
                          📅 {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {task.assignee && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-pink))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', fontWeight: 800, boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                          {task.assignee.name?.[0]?.toUpperCase()}
                        </span>
                        {task.assignee.name}
                      </div>
                    )}
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {status !== 'DONE' ? (
                        <select className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
                          value={status} onChange={(e) => handleUpdateStatus(task.id, e.target.value)}>
                          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                      ) : <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 700 }}>✓ Completed</span>}
                      {isAdmin && (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-ghost btn-sm" style={{ padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)' }} onClick={() => openEditTask(task)}>✏️</button>
                          <button className="btn btn-ghost btn-sm" style={{ padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-rose)' }} onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', marginTop: '0.5rem' }}>
                    No tasks in {STATUS_LABELS[status]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showTaskModal && (
          <Modal title={editingTask ? 'Edit Task Details' : 'Create New Task'} onClose={() => { setShowTaskModal(false); setEditingTask(null); }}>
            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required placeholder="e.g. Implement OAuth2 login, Design landing page" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Provide clear requirements and details for this task..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label>Priority Level</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {editingTask && (
                  <div className="form-group">
                    <label>Workflow Status</label>
                    <select value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Target Due Date</label>
                <input type="datetime-local" value={taskForm.due_date} onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <select value={taskForm.assignee_id} onChange={e => setTaskForm({ ...taskForm, assignee_id: e.target.value })}>
                  <option value="">Unassigned</option>
                  {project.members?.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name} ({m.role})</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowTaskModal(false); setEditingTask(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </>
  );
}
