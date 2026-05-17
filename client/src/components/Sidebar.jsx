import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'TF';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo">TF</div>
        <h1>TaskFlow</h1>
      </div>

      <div style={{ padding: '1rem 1.5rem 0', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
        Main Menu
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          Dashboard
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          Projects
        </NavLink>
      </nav>

      <div style={{ margin: 'auto 1.25rem 1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(139, 92, 246, 0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>TaskFlow Pro</h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>Collaborate seamlessly with advanced role management.</p>
        <div style={{ display: 'inline-block', background: 'var(--accent-indigo)', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise Ready</div>
      </div>

      <div className="sidebar-footer">
        <div className="avatar">{initials}</div>
        <div className="user-info">
          <div className="user-name">{user?.name || 'Guest User'}</div>
          <div className="user-email">{user?.email || 'guest@taskflow.com'}</div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }} onClick={logout} title="Logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-rose)' }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </aside>
  );
}
