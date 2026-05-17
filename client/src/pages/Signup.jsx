import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Account creation failed. Please check your details or try another email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-up" style={{ maxWidth: 520, padding: '2.5rem 3rem' }}>
        <div className="logo-section" style={{ marginBottom: '2rem' }}>
          <div className="logo-icon">TF</div>
          <h1>Create Workspace Account</h1>
          <p className="subtitle">Initialize your premium TaskFlow collaborative platform</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" placeholder="Alex Rivera" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Work Email</label>
            <input id="email" type="email" placeholder="alex@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Security Password</label>
            <input id="password" type="password" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <div className="form-group" style={{ marginTop: '1.75rem', marginBottom: '2rem' }}>
            <label style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'white' }}>Select Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label onClick={() => setRole('ADMIN')} style={{ background: role === 'ADMIN' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0,0,0,0.3)', border: `2px solid ${role === 'ADMIN' ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.1)'}`, padding: '1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.3rem', boxShadow: role === 'ADMIN' ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: role === 'ADMIN' ? 'white' : 'var(--text-secondary)' }}>Admin Role</span>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: role === 'ADMIN' ? 'var(--accent-indigo)' : 'transparent', border: '2px solid white', display: 'inline-block' }}></span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.3 }}>Manage tasks, create projects, and control team access.</span>
              </label>

              <label onClick={() => setRole('MEMBER')} style={{ background: role === 'MEMBER' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0,0,0,0.3)', border: `2px solid ${role === 'MEMBER' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)'}`, padding: '1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.3rem', boxShadow: role === 'MEMBER' ? '0 0 15px rgba(6, 182, 212, 0.3)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: role === 'MEMBER' ? 'white' : 'var(--text-secondary)' }}>Member Role</span>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: role === 'MEMBER' ? 'var(--accent-cyan)' : 'transparent', border: '2px solid white', display: 'inline-block' }}></span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.3 }}>View assigned projects and update task status.</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
            {loading ? 'Initializing Workspace...' : 'Initialize Workspace'}
          </button>
        </form>
        <div className="switch-link">
          Already have a workspace? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
