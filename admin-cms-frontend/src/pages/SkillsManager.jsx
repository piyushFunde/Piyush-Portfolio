import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../api';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Languages', icon: 'SiJava', proficiency: 85, displayOrder: 1
  });

  const categories = ['Languages', 'Frameworks & Libraries', 'Developer Tools', 'Core Concepts'];

  const defaultSkills = [
    { id: 1, name: 'Java', category: 'Languages', icon: 'SiJava', proficiency: 90, displayOrder: 1 },
    { id: 2, name: 'Python', category: 'Languages', icon: 'SiPython', proficiency: 85, displayOrder: 2 },
    { id: 3, name: 'JavaScript / TypeScript', category: 'Languages', icon: 'SiJavascript', proficiency: 88, displayOrder: 3 },
    { id: 4, name: 'Spring Boot', category: 'Frameworks & Libraries', icon: 'SiSpringboot', proficiency: 90, displayOrder: 1 },
    { id: 5, name: 'React.js', category: 'Frameworks & Libraries', icon: 'SiReact', proficiency: 88, displayOrder: 2 },
    { id: 6, name: 'Docker', category: 'Developer Tools', icon: 'SiDocker', proficiency: 82, displayOrder: 1 },
    { id: 7, name: 'REST APIs & Microservices', category: 'Core Concepts', icon: 'SiFastapi', proficiency: 90, displayOrder: 1 }
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getSkills();
        setSkills(res.success && res.data?.length > 0 ? res.data : defaultSkills);
      } catch { setSkills(defaultSkills); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Languages', icon: 'SiJava', proficiency: 85, displayOrder: skills.length + 1 });
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setFormData({ name: s.name, category: s.category || 'Languages', icon: s.icon || '', proficiency: s.proficiency || 80, displayOrder: s.displayOrder || 1 });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try { await api.deleteSkill(id); } catch {}
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await api.updateSkill(editingId, formData); setSkills(prev => prev.map(s => s.id === editingId ? { ...s, ...formData } : s)); }
      else { const res = await api.createSkill(formData); setSkills(prev => [...prev, res.data || { ...formData, id: Date.now() }]); }
    } catch {
      if (editingId) { setSkills(prev => prev.map(s => s.id === editingId ? { ...s, ...formData } : s)); }
      else { setSkills(prev => [...prev, { ...formData, id: Date.now() }]); }
    }
    setIsModalOpen(false);
  };

  // Group skills by category
  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const categoryColors = {
    'Languages': { bg: 'var(--accent-subtle)', color: 'var(--accent)' },
    'Frameworks & Libraries': { bg: 'var(--teal-subtle)', color: 'var(--teal)' },
    'Developer Tools': { bg: 'var(--amber-subtle)', color: 'var(--amber)' },
    'Core Concepts': { bg: 'var(--sky-subtle)', color: 'var(--sky)' }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Skills & Proficiencies</h1>
          <p className="page-desc">Manage your tech stack and expertise levels</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={15} /> <span>Add Skill</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ height: 64 }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {Object.entries(grouped).map(([category, items]) => {
            const colors = categoryColors[category] || { bg: 'var(--accent-subtle)', color: 'var(--accent)' };
            return (
              <div key={category}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span className="badge" style={{ background: colors.bg, color: colors.color }}>{category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{items.length} skills</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                  {items.map(s => (
                    <div
                      key={s.id}
                      style={{
                        padding: '14px 16px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'border-color 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block' }}>{s.name}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{
                              width: `${s.proficiency}%`,
                              height: '100%',
                              background: colors.color,
                              borderRadius: 2,
                              transition: 'width 0.6s var(--ease-out)'
                            }} />
                          </div>
                          <span className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: 28, textAlign: 'right' }}>{s.proficiency}%</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openEdit(s)} className="btn-icon" title="Edit"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(s.id)} className="btn-icon" title="Delete" style={{ color: 'var(--rose)' }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Skill' : 'Add Skill'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Skill Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Spring Boot, Docker" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Icon (React-Icons)</label>
                  <input type="text" className="form-input" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="SiSpringboot" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Proficiency — {formData.proficiency}%</label>
                <input type="range" min="30" max="100" step="5" value={formData.proficiency} onChange={e => setFormData({ ...formData, proficiency: parseInt(e.target.value) })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Add Skill'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
