import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Clock, Inbox } from 'lucide-react';
import { api } from '../api';

export default function MessagesManager({ onMessagesUpdated }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getMessages();
        const data = res.success && Array.isArray(res.data) ? res.data : [];
        setMessages(data);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
        if (onMessagesUpdated) onMessagesUpdated();
      }
    }
    load();
  }, []);

  const handleMarkRead = async (id) => {
    try { await api.markMessageRead(id); } catch {}
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    if (onMessagesUpdated) onMessagesUpdated();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await api.deleteMessage(id); } catch {}
    setMessages(prev => prev.filter(m => m.id !== id));
    if (onMessagesUpdated) onMessagesUpdated();
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Messages</h1>
          <p className="page-desc">
            Contact form inquiries
            {unreadCount > 0 && <span style={{ color: 'var(--accent)', fontWeight: 600 }}> · {unreadCount} unread</span>}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px' }}>
          <div className="empty-state">
            <div className="empty-state-icon"><Inbox size={24} /></div>
            <p className="empty-state-title">Inbox is empty</p>
            <p className="empty-state-desc">Messages from your portfolio contact form will appear here</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map(m => (
            <div
              key={m.id}
              className="card"
              style={{
                padding: '18px 22px',
                borderLeft: m.isRead ? '1px solid var(--border-subtle)' : '3px solid var(--accent)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: m.isRead ? 'var(--bg-overlay)' : 'var(--accent-subtle)',
                    color: m.isRead ? 'var(--text-muted)' : 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.78rem', fontWeight: 700, flexShrink: 0
                  }}>
                    {(m.name || 'U').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{m.name}</strong>
                      {!m.isRead && <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>NEW</span>}
                    </div>
                    <a href={`mailto:${m.email}`} style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>{m.email}</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {!m.isRead && (
                    <button onClick={() => handleMarkRead(m.id)} className="btn btn-secondary btn-sm" title="Mark as read">
                      <Check size={13} /> <span>Read</span>
                    </button>
                  )}
                  <button onClick={() => handleDelete(m.id)} className="btn-icon" title="Delete" style={{ color: 'var(--rose)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Subject */}
              {m.subject && (
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {m.subject}
                </h4>
              )}

              {/* Message body */}
              <div style={{
                fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65,
                padding: '10px 14px', background: 'var(--bg-base)',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)'
              }}>
                {m.message}
              </div>

              {/* Timestamp */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: 8 }}>
                <Clock size={11} />
                <span>{new Date(m.createdAt || Date.now()).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
