import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, ExternalLink, X } from 'lucide-react';
import { api } from '../api';

export default function CertificatesManager() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', displayOrder: 1
  });

  const defaultCerts = [
    { id: 1, title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2024', credentialUrl: '#', displayOrder: 1 },
    { id: 2, title: 'Oracle Certified Associate: Java SE', issuer: 'Oracle', issueDate: '2023', credentialUrl: '#', displayOrder: 2 },
    { id: 3, title: 'Full Stack Development Specialization', issuer: 'Coursera', issueDate: '2023', credentialUrl: '#', displayOrder: 3 }
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCertificates();
        setCerts(res.success && res.data?.length > 0 ? res.data : defaultCerts);
      } catch { setCerts(defaultCerts); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', displayOrder: certs.length + 1 });
    setIsModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setFormData({ title: c.title, issuer: c.issuer || '', issueDate: c.issueDate || '', credentialUrl: c.credentialUrl || '', imageUrl: c.imageUrl || '', displayOrder: c.displayOrder || 1 });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try { await api.deleteCertificate(id); } catch {}
    setCerts(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await api.updateCertificate(editingId, formData); setCerts(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c)); }
      else { const res = await api.createCertificate(formData); setCerts(prev => [...prev, res.data || { ...formData, id: Date.now() }]); }
    } catch {
      if (editingId) { setCerts(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c)); }
      else { setCerts(prev => [...prev, { ...formData, id: Date.now() }]); }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Certificates</h1>
          <p className="page-desc">Manage professional credentials and badges</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={15} /> <span>Add Certificate</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : certs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Award size={22} /></div>
          <p className="empty-state-title">No certificates added</p>
          <p className="empty-state-desc">Add your professional certifications</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {certs.map(c => (
            <div key={c.id} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                    background: 'var(--amber-subtle)', color: 'var(--amber)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Award size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>{c.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.issuer}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => openEdit(c)} className="btn-icon" title="Edit"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(c.id)} className="btn-icon" title="Delete" style={{ color: 'var(--rose)' }}><Trash2 size={13} /></button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>{c.issueDate}</span>
                {c.credentialUrl && c.credentialUrl !== '#' && (
                  <a href={c.credentialUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                    Verify <ExternalLink size={11} />
                  </a>
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
                {editingId ? 'Edit Certificate' : 'Add Certificate'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Certificate Title</label>
                <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="AWS Certified Developer" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Issuing Organization</label>
                  <input type="text" className="form-input" value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} placeholder="Amazon Web Services" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input type="text" className="form-input" value={formData.issueDate} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} placeholder="2024" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Credential URL</label>
                <input type="url" className="form-input" value={formData.credentialUrl} onChange={e => setFormData({ ...formData, credentialUrl: e.target.value })} placeholder="https://..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Add Certificate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
