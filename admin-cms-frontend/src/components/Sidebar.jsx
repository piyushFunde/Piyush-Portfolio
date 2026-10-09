import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  FolderKanban,
  Sparkles,
  Briefcase,
  Award,
  BookOpen,
  Image,
  Mail,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { removeAuthToken } from '../api';

export default function Sidebar({ unreadCount = 0 }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/about', icon: User, label: 'About Me' },
    { to: '/resume', icon: FileText, label: 'Resume & CV' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/skills', icon: Sparkles, label: 'Skills' },
    { to: '/experience', icon: Briefcase, label: 'Experience' },
    { to: '/certificates', icon: Award, label: 'Certificates' },
    { to: '/blogs', icon: BookOpen, label: 'Blog Posts' },
    { to: '/gallery', icon: Image, label: 'Media' },
    { to: '/messages', icon: Mail, label: 'Messages', badge: unreadCount },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-badge">P</div>
        <div>
          <h2 className="brand-title">Piyush CMS</h2>
          <span className="brand-subtitle">Admin Panel</span>
        </div>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.to === '/'}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
          title="View Live Portfolio"
        >
          <ExternalLink size={13} />
          <span>Live Site</span>
        </a>
        <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Log Out">
          <LogOut size={13} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
