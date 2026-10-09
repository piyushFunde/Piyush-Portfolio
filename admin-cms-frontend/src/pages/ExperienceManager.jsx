import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, MapPin, Calendar } from 'lucide-react';
import { api } from '../api';

export default function ExperienceManager() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '', role: '', location: '', startDate: '', endDate: '',
    current: false, description: '', achievements: '', displayOrder: 1
  });

  const defaultExp = [
    {
      id: 1,
      company: 'Labmentix',
      role: 'Full Stack Developer Intern',
      location: 'Pune, India',
      startDate: 'June 2026',
      endDate: 'Present',
      current: true,
      description: 'Working on full-stack web applications using Java, Spring Boot, React, REST APIs, and MySQL.',
      achievements: [
        'Developing backend APIs and integrating MySQL databases',
        'Implementing core application features and optimizing responsiveness',
        'Debugging, testing, and collaborating with Git workflows'
      ],
      displayOrder: 1
    },
    {
      id: 2,
      company: 'EVA Groups',
      role: 'Freelance Full Stack Developer',
      location: 'Remote',
      startDate: 'March 2026',
      endDate: 'June 2026',
      current: false,
      description: 'Built EVA CRM, a complete collection management system actively used by real-world users.',
      achievements: [
        'Engineered full-stack architecture with React, Spring Boot, MySQL, and JWT',
        'Implemented customer assignment, payment tracking, and receipt uploads',
        'Added offline support and real-time synchronization using WebSockets',
        'Handled client requirements and production deployment independently'
      ],
      displayOrder: 2
    }
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getExperience();
        setExperience(res.success && res.data?.length > 0 ? res.data : defaultExp);
      } catch { setExperience(defaultExp); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ company: '', role: '', location: 'Remote', startDate: '', endDate: '', current: false, description: '', achievements: '', displayOrder: experience.length + 1 });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      company: item.company, role: item.role, location: item.location || '',
      startDate: item.startDate || '', endDate: item.endDate || '', current: !!item.current,
      description: item.description || '',
      achievements: Array.isArray(item.achievements) ? item.achievements.join('\n') : item.achievements || '',
      displayOrder: item.displayOrder || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try { await api.deleteExperience(id); } catch {}
    setExperience(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      achievements: typeof formData.achievements === 'string'
        ? formData.achievements.split('\n').map(s => s.trim()).filter(Boolean)
        : formData.achievements
    };
    try {
      if (editingId) { await api.updateExperience(editingId, payload); setExperience(prev => prev.map(e => e.id === editingId ? { ...e, ...payload } : e)); }
      else { const res = await api.createExperience(payload); setExperience(prev => [...prev, res.data || { ...payload, id: Date.now() }]); }
    } catch {
      if (editingId) { setExperience(prev => prev.map(e => e.id === editingId ? { ...e, ...payload } : e)); }
      else { setExperience(prev => [...prev, { ...payload, id: Date.now() }]); }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Experience</h1>
          <p className="page-desc">Manage career history and professional roles</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={15} /> <span>Add Position</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : experience.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Calendar size={22} /></div>
          <p className="empty-state-title">No experience added</p>
          <p className="empty-state-desc">Add your professional experience to showcase</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {experience.map((exp, idx) => (
            <div
              key={exp.id}
              className="card"
              style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px 22px' }}
            >
              {/* Timeline dot */}
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: exp.current ? 'var(--teal)' : 'var(--text-faint)',
                border: '2px solid var(--bg-surface)',
                boxShadow: exp.current ? 'var(--shadow-glow-teal)' : 'none',
                flexShrink: 0, marginTop: 6
              }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'block' }}>{exp.role}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>{exp.company}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={() => openEdit(exp)} className="btn-icon" title="Edit"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(exp.id)} className="btn-icon" title="Delete" style={{ color: 'var(--rose)' }}><Trash2 size={13} /></button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Calendar size={12} />
                    {exp.startDate} — {exp.current ? <span style={{ color: 'var(--teal)', fontWeight: 600 }}>Present</span> : exp.endDate}
                  </span>
                  {exp.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <MapPin size={12} /> {exp.location}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>{exp.description}</p>
                )}

                {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                  <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 2 }}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Position' : 'Add Position'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Role / Title</label>
                  <input type="text" className="form-input" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="Full Stack Engineer" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-input" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Acme Corp" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="text" className="form-input" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} placeholder="Jan 2024" required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="text" className="form-input" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} placeholder="Present" disabled={formData.current} />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Remote" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={formData.current} onChange={e => setFormData({ ...formData, current: e.target.checked })} />
                  <span>Currently working here</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of your role..." style={{ minHeight: 80 }} />
              </div>

              <div className="form-group">
                <label className="form-label">Key Achievements (one per line)</label>
                <textarea className="form-textarea" value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })} placeholder={"Implemented secure JWT auth\nOptimized queries by 35%"} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Add Position'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
