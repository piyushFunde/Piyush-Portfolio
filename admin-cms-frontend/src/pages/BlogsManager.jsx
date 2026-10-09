import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Clock } from 'lucide-react';
import { api } from '../api';

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '',
    coverImage: '', tags: '', readTime: '5 min read', published: true
  });

  const defaultBlogs = [{
    id: 1, title: 'Architecting a Custom Headless CMS with Spring Boot 3 & Next.js',
    slug: 'architecting-custom-headless-cms-spring-boot',
    excerpt: 'A deep-dive into creating your own decoupled content management engine.',
    tags: ['Java', 'Spring Boot', 'Architecture', 'CMS'], readTime: '6 min read', published: true
  }];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getBlogs();
        setBlogs(res.success && res.data?.length > 0 ? res.data : defaultBlogs);
      } catch { setBlogs(defaultBlogs); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleTitleChange = (val) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, title: val, ...(editingId ? {} : { slug }) }));
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', readTime: '5 min read', published: true });
    setIsModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setFormData({
      title: b.title, slug: b.slug, excerpt: b.excerpt || '', content: b.content || '',
      coverImage: b.coverImage || '', tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags || '',
      readTime: b.readTime || '5 min read', published: !!b.published
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try { await api.deleteBlog(id); } catch {}
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : formData.tags };
    try {
      if (editingId) { await api.updateBlog(editingId, payload); setBlogs(prev => prev.map(b => b.id === editingId ? { ...b, ...payload } : b)); }
      else { const res = await api.createBlog(payload); setBlogs(prev => [...prev, res.data || { ...payload, id: Date.now() }]); }
    } catch {
      if (editingId) { setBlogs(prev => prev.map(b => b.id === editingId ? { ...b, ...payload } : b)); }
      else { setBlogs(prev => [...prev, { ...payload, id: Date.now() }]); }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog Posts</h1>
          <p className="page-desc">Publish articles and technical writings</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={15} /> <span>Write Article</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Edit2 size={22} /></div>
          <p className="empty-state-title">No articles yet</p>
          <p className="empty-state-desc">Start writing your first blog post</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {blogs.map(b => (
            <div
              key={b.id}
              className="card"
              style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{b.title}</strong>
                  {b.published ? (
                    <span className="badge badge-green"><Eye size={10} /> Live</span>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}><EyeOff size={10} /> Draft</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span className="text-mono" style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>/{b.slug}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <Clock size={11} /> {b.readTime || '5 min'}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(Array.isArray(b.tags) ? b.tags : []).map((t, i) => (
                      <span key={i} className="badge badge-purple">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={() => openEdit(b)} className="btn-icon" title="Edit"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(b.id)} className="btn-icon" title="Delete" style={{ color: 'var(--rose)' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Article' : 'New Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={formData.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Microservices Architecture with Spring Cloud" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input type="text" className="form-input text-mono" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required style={{ fontSize: '0.82rem' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Read Time</label>
                  <input type="text" className="form-input" value={formData.readTime} onChange={e => setFormData({ ...formData, readTime: e.target.value })} placeholder="5 min read" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Excerpt</label>
                <input type="text" className="form-input" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Short summary for preview cards..." />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input type="text" className="form-input" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="Java, Spring Boot, Architecture" />
              </div>

              <div className="form-group">
                <label className="form-label">Content (Markdown)</label>
                <textarea className="form-textarea text-mono" style={{ minHeight: 160, fontSize: '0.82rem' }} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Write your markdown content..." />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} />
                  <span>Publish immediately</span>
                </label>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Publish'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
