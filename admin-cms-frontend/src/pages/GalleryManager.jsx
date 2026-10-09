import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { api } from '../api';

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Events');

  const defaultItems = [
    { id: 1, title: 'Smart India Hackathon', category: 'Hackathons', imageUrl: '/BedsideBot.png', caption: 'Presenting AI Bedside Assistant' },
    { id: 2, title: 'Tech Symposium Keynote', category: 'Events', imageUrl: '/portfolio.jpg', caption: 'Technical presentation on Spring Boot' }
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getGallery();
        setItems(res.success && res.data?.length > 0 ? res.data : defaultItems);
      } catch { setItems(defaultItems); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadMedia(file);
      if (res.success && res.data) {
        const newItem = { title: newTitle || file.name, category: newCategory, imageUrl: res.data.url, caption: newTitle || 'Uploaded media' };
        const createRes = await api.createGalleryItem(newItem);
        setItems(prev => [...prev, createRes.data || { ...newItem, id: Date.now() }]);
        setNewTitle('');
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setItems(prev => [...prev, { id: Date.now(), title: newTitle || file.name, category: newCategory, imageUrl: reader.result, caption: 'Local preview' }]);
      };
      reader.readAsDataURL(file);
    } finally { setUploading(false); }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this asset?')) return;
    try { await api.deleteGalleryItem(id); } catch {}
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-desc">Upload and manage screenshots, badges, and assets</p>
        </div>
      </div>

      {/* Upload area */}
      <div className="card" style={{ marginBottom: 24, textAlign: 'center', padding: '32px 24px', border: '1px dashed var(--border-hover)' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-md)',
          background: 'var(--accent-subtle)', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px'
        }}>
          <Upload size={20} />
        </div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Upload Media</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>PNG, JPG, WebP, SVG — up to 15 MB</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 400, margin: '0 auto 14px' }}>
          <input type="text" className="form-input" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title (optional)" />
          <select className="form-select" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
            <option value="Projects">Projects</option>
            <option value="Certificates">Certificates</option>
            <option value="Events">Events</option>
            <option value="General">General</option>
          </select>
        </div>

        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={14} />
          <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><ImageIcon size={22} /></div>
          <p className="empty-state-title">No media uploaded</p>
          <p className="empty-state-desc">Upload your first media file above</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: 12, overflow: 'hidden' }}>
              <div style={{
                height: 140, borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                background: 'var(--bg-base)', marginBottom: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }} className="truncate">{item.title}</strong>
                <span className="badge badge-purple">{item.category}</span>
              </div>

              {item.caption && <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }} className="truncate">{item.caption}</p>}

              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => handleCopy(item.imageUrl, item.id)} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  {copiedId === item.id ? <><Check size={12} color="var(--teal)" /> Copied</> : <><Copy size={12} /> Copy URL</>}
                </button>
                <button onClick={() => handleDelete(item.id)} className="btn-icon" title="Delete" style={{ color: 'var(--rose)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
