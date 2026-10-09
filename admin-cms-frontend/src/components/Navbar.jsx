import React from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Activity } from 'lucide-react';

const routeNames = {
  '/': 'Dashboard',
  '/about': 'About & Profile',
  '/projects': 'Projects',
  '/skills': 'Skills',
  '/experience': 'Experience',
  '/certificates': 'Certificates',
  '/blogs': 'Blog Posts',
  '/gallery': 'Media & Gallery',
  '/messages': 'Messages',
};

export default function Navbar({ username = 'Piyush' }) {
  const location = useLocation();
  const currentPage = routeNames[location.pathname] || 'Dashboard';

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>CMS</span>
          <span style={{ color: 'var(--text-faint)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{currentPage}</span>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* System status */}
        <div className="system-status">
          <span className="status-pulse" />
          <span>Online</span>
        </div>

        {/* Portfolio link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
          title="Open Public Portfolio"
        >
          <ExternalLink size={13} />
          <span>Portfolio</span>
        </a>

        {/* User avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px 4px 4px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)'
        }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{username}</span>
        </div>
      </div>
    </header>
  );
}
