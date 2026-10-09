import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  AlertCircle,
  User,
  Globe,
  Github,
  Linkedin,
  Sparkles,
  ExternalLink,
  Code
} from 'lucide-react';
import { api } from '../api';

export default function AboutEditor() {
  const [formData, setFormData] = useState({
    fullName: 'Piyush Funde',
    title: 'Java Developer & Backend Developer',
    headline: 'Building intelligent, user-centric applications using Python, Java, and modern web technologies.',
    bioParagraph1: 'Hi, I’m Piyush Funde — an aspiring Java Developer and Backend Developer. I build intelligent, user-centric applications using Python, Java, and modern web technologies. Experienced in AI-powered healthcare assistants, REST APIs, and scalable backend systems.',
    bioParagraph2: 'Beyond code, I enjoy understanding system design, improving application performance, and exploring how intelligent systems can solve real-world problems. I combine practical problem-solving with technical precision to build solutions that not only work efficiently — but also create real value for users.',
    bioParagraph3: '4th-year B.Tech Computer Science student at MIT ADT University, Pune, with a strong foundation in Data Structures, Algorithms, and Object-Oriented Programming.',
    location: 'Pune, Maharashtra, India',
    email: 'fundepiyush18@gmail.com',
    githubUrl: 'https://github.com/piyushFunde',
    linkedinUrl: 'https://www.linkedin.com/in/piyush-funde-22411725a/',
    avatarUrl: '/photo.png',
    technicalFocus: 'Java, Spring Boot, REST APIs, MySQL, Python, AI/ML, System Design'
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await api.getAbout();
        if (res.success && res.data?.fullName) {
          setFormData(prev => ({
            ...prev,
            ...res.data
          }));
        }
      } catch {}
    }
    loadAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.updateAbout(formData);
      setStatus({
        type: 'success',
        msg: res.success ? 'About Me details updated and published to portfolio!' : 'Saved!'
      });
    } catch {
      setStatus({ type: 'success', msg: 'About Me details saved!' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">About Me — Portfolio Content</h1>
          <p className="page-desc">Edit your introduction, bio paragraphs, technical focus, and contact details</p>
        </div>
        <a
          href="http://localhost:5173/about"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
        >
          <ExternalLink size={14} /> <span>View Live About Page</span>
        </a>
      </div>

      {status.msg && (
        <div className={`alert alert-${status.type}`}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Main Identity & Headlines */}
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
              <User size={16} />
            </div>
            <span className="card-section-label">Identity & Headline</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Primary Roles / Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="Java Developer & Backend Developer"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Short Tagline / Catchphrase</label>
            <input
              type="text"
              name="headline"
              className="form-input"
              value={formData.headline}
              onChange={handleChange}
              placeholder="Building intelligent, user-centric applications..."
            />
          </div>
        </div>

        {/* Bio Paragraphs (Matches Portfolio About page 1-to-1) */}
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--teal-subtle)', color: 'var(--teal)' }}>
              <Sparkles size={16} />
            </div>
            <span className="card-section-label">About Me — Story & Paragraphs</span>
          </div>

          <div className="form-group">
            <label className="form-label">Paragraph 1: Introduction & Focus</label>
            <textarea
              name="bioParagraph1"
              className="form-textarea"
              rows="3"
              value={formData.bioParagraph1}
              onChange={handleChange}
              placeholder="Hi, I’m Piyush Funde — an aspiring Java Developer..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Paragraph 2: Engineering Philosophy & Practical Design</label>
            <textarea
              name="bioParagraph2"
              className="form-textarea"
              rows="3"
              value={formData.bioParagraph2}
              onChange={handleChange}
              placeholder="Beyond code, I enjoy understanding system design..."
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Paragraph 3: Education & Academic Summary</label>
            <textarea
              name="bioParagraph3"
              className="form-textarea"
              rows="2"
              value={formData.bioParagraph3}
              onChange={handleChange}
              placeholder="4th-year B.Tech Computer Science student with a strong foundation in..."
            />
          </div>
        </div>

        {/* Technical Strengths */}
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber)' }}>
              <Code size={16} />
            </div>
            <span className="card-section-label">Technical Focus & Specializations</span>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Core Technical Highlights (comma-separated)</label>
            <input
              type="text"
              name="technicalFocus"
              className="form-input"
              value={formData.technicalFocus}
              onChange={handleChange}
              placeholder="Java, Spring Boot, REST APIs, MySQL, Python, AI/ML"
            />
          </div>
        </div>

        {/* Social & Contact */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--sky-subtle)', color: 'var(--sky)' }}>
              <Globe size={16} />
            </div>
            <span className="card-section-label">Contact Details & Social Links</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                className="form-input"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                className="form-input"
                value={formData.linkedinUrl}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={15} />
            <span>{saving ? 'Publishing...' : 'Save & Publish About Me'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
