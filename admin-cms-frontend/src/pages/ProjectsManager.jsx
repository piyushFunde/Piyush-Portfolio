import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Github, Star, X } from 'lucide-react';
import { api } from '../api';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', screenshotUrl: '', tech: '',
    liveUrl: '', codeUrl: '', featured: false, displayOrder: 0
  });

  const defaultProjects = [
    { id: 1, title: '🩺 Bedside Bot', description: 'AI-powered hospital assistant with gesture recognition, voice commands, and emotion detection.', screenshotUrl: '/BedsideBot.png', tech: ['Python', 'Flask', 'OpenCV', 'Mediapipe', 'DeepFace'], liveUrl: '#', codeUrl: 'https://github.com/piyushFunde/Bedsidebot_app', featured: true, displayOrder: 1 },
    { id: 2, title: '⚙️ Visual Pipeline Engine', description: 'Drag-and-drop DAG workflow builder with Spring Boot & React Flow.', screenshotUrl: '/VisualPipelineEngine.png', tech: ['React', 'React Flow', 'Java', 'Spring Boot'], liveUrl: '#', codeUrl: 'https://github.com/piyushFunde/Visual-Pipeline-Engine', featured: true, displayOrder: 2 },
    { id: 3, title: '🐞 BugFix AI', description: 'Automated bug analysis system that generates code fix recommendations.', screenshotUrl: '/BugFixAI.png', tech: ['Java', 'Spring Boot', 'REST API', 'AI/LLM', 'PostgreSQL'], liveUrl: 'https://bugfix-ai-backend-odli.onrender.com/', codeUrl: 'https://github.com/piyushFunde/BugFix-Ai', featured: true, displayOrder: 3 },
    { id: 4, title: '💰 Expense Tracker', description: 'Desktop financial tracker with categorization and data visualization.', screenshotUrl: '/expense.png', tech: ['Python', 'Tkinter', 'SQLite'], liveUrl: '#', codeUrl: 'https://github.com/piyushFunde/expense-tracker', featured: false, displayOrder: 4 }
  ];

  const loadProjects = async () => {
    try {
      const res = await api.getProjects();
      setProjects(res.success && res.data?.length > 0 ? res.data : defaultProjects);
    } catch { setProjects(defaultProjects); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProjects(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', screenshotUrl: '', tech: '', liveUrl: '', codeUrl: '', featured: false, displayOrder: projects.length + 1 });
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setFormData({ title: p.title, description: p.description, screenshotUrl: p.screenshotUrl || '', tech: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech || '', liveUrl: p.liveUrl || '', codeUrl: p.codeUrl || '', featured: !!p.featured, displayOrder: p.displayOrder || 0 });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await api.deleteProject(id); } catch {}
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, tech: typeof formData.tech === 'string' ? formData.tech.split(',').map(s => s.trim()).filter(Boolean) : formData.tech };
    try {
      if (editingId) { await api.updateProject(editingId, payload); setProjects(prev => prev.map(p => p.id === editingId ? { ...p, ...payload } : p)); }
      else { const res = await api.createProject(payload); setProjects(prev => [...prev, res.data || { ...payload, id: Date.now() }]); }
    } catch {
      if (editingId) { setProjects(prev => prev.map(p => p.id === editingId ? { ...p, ...payload } : p)); }
      else { setProjects(prev => [...prev, { ...payload, id: Date.now() }]); }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-desc">Manage portfolio showcase projects</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={15} />
          <span>Add Project</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 72 }} />)}
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 56 }}>#</th>
                <th>Project</th>
                <th>Tech Stack</th>
                <th>Status</th>
                <th>Links</th>
                <th style={{ textAlign: 'right', width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <span className="text-mono text-muted" style={{ fontSize: '0.78rem' }}>{p.displayOrder}</span>
                  </td>
                  <td style={{ maxWidth: 280 }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.9rem', marginBottom: 2 }}>{p.title}</strong>
                    <span className="clamp-2" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.description}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(Array.isArray(p.tech) ? p.tech : []).slice(0, 3).map((t, i) => (
                        <span key={i} className="badge badge-purple">{t}</span>
                      ))}
                      {(Array.isArray(p.tech) ? p.tech : []).length > 3 && (
                        <span className="badge badge-cyan">+{p.tech.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {p.featured ? (
                      <span className="badge badge-amber" style={{ gap: 3 }}>
                        <Star size={10} /> Featured
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-faint)', fontSize: '0.78rem' }}>Standard</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.codeUrl && <a href={p.codeUrl} target="_blank" rel="noreferrer" title="Source" style={{ color: 'var(--text-muted)' }}><Github size={15} /></a>}
                      {p.liveUrl && p.liveUrl !== '#' && <a href={p.liveUrl} target="_blank" rel="noreferrer" title="Demo" style={{ color: 'var(--accent)' }}><ExternalLink size={15} /></a>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => openEdit(p)} className="btn-icon" title="Edit"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="btn-icon" title="Delete" style={{ color: 'var(--rose)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Bedside Bot" required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief summary of the project..." required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Screenshot URL</label>
                  <input type="text" className="form-input" value={formData.screenshotUrl} onChange={e => setFormData({ ...formData, screenshotUrl: e.target.value })} placeholder="/image.png or https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Tech Stack (comma-separated)</label>
                  <input type="text" className="form-input" value={formData.tech} onChange={e => setFormData({ ...formData, tech: e.target.value })} placeholder="React, Spring Boot, Docker" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Live Demo URL</label>
                  <input type="text" className="form-input" value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} placeholder="https://my-app.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input type="text" className="form-input" value={formData.codeUrl} onChange={e => setFormData({ ...formData, codeUrl: e.target.value })} placeholder="https://github.com/..." />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} />
                  <span>Featured project</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label className="form-label" style={{ margin: 0 }}>Order</label>
                  <input type="number" className="form-input" style={{ width: 64, padding: '6px 8px', textAlign: 'center' }} value={formData.displayOrder} onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
