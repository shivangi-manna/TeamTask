import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Modal from '../components/Modal';

export default function Team() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', role: 'MEMBER' });
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = () => {
    api.get(`/projects/${id}/members`).then(r => setMembers(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(fetchMembers, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/projects/${id}/members`, form);
      setShowModal(false);
      setForm({ email: '', role: 'MEMBER' });
      fetchMembers();
    } catch (err) { alert(err.response?.data?.detail || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await api.put(`/projects/${id}/members/${memberId}`, { role: newRole });
      fetchMembers();
    } catch (err) { alert(err.response?.data?.detail || 'Error'); }
  };

  const handleRemove = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member from the project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${memberId}`);
      fetchMembers();
    } catch (err) { alert(err.response?.data?.detail || 'Error'); }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/projects/${id}`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Project
          </button>
          <h2>Team Access Management</h2>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Team Member
        </button>
      </div>
      <div className="page-content fade-in">
        <div className="page-header">
          <h1>Workspace Collaborators</h1>
          <p>Add, remove, and manage role-based permissions for your team members.</p>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div className="members-list">
            {members.map((m, i) => (
              <div key={m.id} className="member-row slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="member-info">
                  <div className="member-avatar">{m.user.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'white' }}>{m.user.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{m.user.email}</div>
                  </div>
                </div>
                <div className="member-actions">
                  <span className={`badge badge-${m.role.toLowerCase()}`}>{m.role}</span>
                  <select value={m.role} onChange={(e) => handleRoleChange(m.id, e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', fontSize: '0.85rem', fontWeight: 600, width: 'auto' }}>
                    <option value="ADMIN">Admin Access</option>
                    <option value="MEMBER">Member Access</option>
                  </select>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-rose)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)' }} onClick={() => handleRemove(m.id)}>Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <Modal title="Invite Collaborator" onClose={() => setShowModal(false)}>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>User Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="colleague@taskflow.com" />
              </div>
              <div className="form-group">
                <label>Permission Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="MEMBER">Member (Can update task status)</option>
                  <option value="ADMIN">Admin (Full project & team control)</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Inviting...' : 'Send Invitation'}</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </>
  );
}
