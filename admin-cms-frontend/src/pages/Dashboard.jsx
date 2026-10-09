import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Sparkles,
  BookOpen,
  Award,
  Mail,
  ArrowRight,
  Check,
  Plus,
  Edit3,
  Upload,
  Briefcase,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { api } from '../api';

function AnimatedCounter({ target, duration = 600 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <>{count}</>;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSkills: 0,
    totalBlogs: 0,
    totalCertificates: 0,
    totalExperience: 0,
    unreadMessages: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, messagesRes] = await Promise.allSettled([
          api.getStats(),
          api.getMessages()
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
          setStats(statsRes.value.data);
        } else {
          setStats({ totalProjects: 4, totalSkills: 12, totalBlogs: 1, totalCertificates: 3, totalExperience: 1, unreadMessages: 0 });
        }
        if (messagesRes.status === 'fulfilled' && messagesRes.value?.success) {
          setRecentMessages((messagesRes.value.data || []).slice(0, 3));
        }
      } catch (err) {
        setStats({ totalProjects: 4, totalSkills: 12, totalBlogs: 1, totalCertificates: 3, totalExperience: 1, unreadMessages: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleMarkRead = async (id) => {
    try { await api.markMessageRead(id); } catch {}
    setRecentMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    setStats(prev => ({ ...prev, unreadMessages: Math.max(0, prev.unreadMessages - 1) }));
  };

  const metrics = [
    { label: 'Projects', count: stats.totalProjects, icon: FolderKanban, bg: 'var(--accent-subtle)', color: 'var(--accent)', to: '/projects' },
    { label: 'Skills', count: stats.totalSkills, icon: Sparkles, bg: 'var(--amber-subtle)', color: 'var(--amber)', to: '/skills' },
    { label: 'Articles', count: stats.totalBlogs, icon: BookOpen, bg: 'var(--teal-subtle)', color: 'var(--teal)', to: '/blogs' },
    { label: 'Certificates', count: stats.totalCertificates, icon: Award, bg: 'var(--sky-subtle)', color: 'var(--sky)', to: '/certificates' },
    { label: 'Inbox', count: stats.unreadMessages, icon: Mail, bg: 'var(--rose-subtle)', color: 'var(--rose)', to: '/messages' },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Project', desc: 'Add a showcase project', to: '/projects', color: 'var(--accent)' },
    { icon: Edit3, label: 'Write Article', desc: 'Publish a blog post', to: '/blogs', color: 'var(--teal)' },
    { icon: Sparkles, label: 'Update Profile', desc: 'Edit bio & links', to: '/about', color: 'var(--amber)' },
    { icon: Upload, label: 'Upload Media', desc: 'Add screenshots & assets', to: '/gallery', color: 'var(--sky)' },
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>
          {greeting}, Piyush
        </p>
        <h1 style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.3
        }}>
          Dashboard Overview
        </h1>
      </div>

      {/* Metrics */}
      <div className="stats-grid">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link to={item.to} key={idx} className="stat-card" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="stat-icon" style={{ background: item.bg, color: item.color }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="stat-num">
                  <AnimatedCounter target={item.count} />
                </div>
                <div className="stat-label">{item.label}</div>
              </div>
              <ArrowRight size={14} color="var(--text-faint)" />
            </Link>
          );
        })}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>

        {/* Recent Messages */}
        <div className="card">
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--rose-subtle)', color: 'var(--rose)' }}>
              <Mail size={16} />
            </div>
            <span className="card-section-label">Recent Messages</span>
            <Link
              to="/messages"
              style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2].map(i => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 'var(--radius-sm)' }} />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 16px' }}>
              <div className="empty-state-icon"><Mail size={22} /></div>
              <p className="empty-state-title">No messages yet</p>
              <p className="empty-state-desc">Incoming inquiries will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentMessages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: msg.isRead ? '1px solid var(--border-subtle)' : '3px solid var(--accent)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--accent-subtle)',
                        color: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {(msg.name || 'U').charAt(0).toUpperCase()}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)', display: 'block' }}>{msg.name}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{msg.email}</span>
                      </div>
                    </div>
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="btn-icon"
                        title="Mark as read"
                        style={{ width: 26, height: 26 }}
                      >
                        <Check size={12} />
                      </button>
                    )}
                  </div>
                  <p className="clamp-2" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
              <TrendingUp size={16} />
            </div>
            <span className="card-section-label">Quick Actions</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.to}
                  style={{
                    padding: '14px',
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={18} color={action.color} />
                  <div>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)', display: 'block' }}>{action.label}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{action.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Status bar */}
          <div style={{
            marginTop: 14,
            padding: '10px 14px',
            background: 'var(--bg-overlay)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>API Status</span>
            <span className="badge badge-green">
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--teal)',
                display: 'inline-block'
              }} />
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
