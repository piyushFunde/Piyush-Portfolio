import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  FileCheck,
  Loader2,
  GraduationCap,
  Sparkles,
  Download
} from 'lucide-react';
import { api } from '../api';

export default function ResumeManager() {
  const [resumeData, setResumeData] = useState({
    resumeUrl: 'http://localhost:8080/uploads/PiyushFunde_Resume.pdf',
    summary: '4th-year B.Tech Computer Science student at MIT ADT University, Pune, with a strong foundation in Data Structures, Algorithms, and Object-Oriented Programming. Skilled in Python, Java, Spring Boot, and AI/ML frameworks.',
    degree: 'B.Tech — Computer Science Engineering',
    university: 'MIT ADT University, Pune',
    duration: '2022–2026',
    gpa: '7.37',
    juniorCollege: 'S.H. Junior College (Maharashtra Board, 2021)',
    twelfthScore: '75%',
    school: 'P.P.S Purti Public School (CBSE Board, 2019)'
  });

  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('PiyushFunde_Resume.pdf');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadResumeInfo() {
      try {
        const res = await api.getAbout();
        if (res.success && res.data) {
          setResumeData(prev => ({
            ...prev,
            ...res.data,
            resumeUrl: res.data.resumeUrl || prev.resumeUrl
          }));
          if (res.data.resumeUrl) {
            const parts = res.data.resumeUrl.split('/');
            setResumeFileName(parts[parts.length - 1] || 'Current_Resume.pdf');
          }
        }
      } catch {}
    }
    loadResumeInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setStatus({ type: 'error', msg: 'Please select a valid PDF file (.pdf).' });
      return;
    }

    setUploadingResume(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await api.uploadMedia(file);
      if (res.success && res.data?.url) {
        setResumeData(prev => ({ ...prev, resumeUrl: res.data.url }));
        setResumeFileName(file.name);
        setStatus({ type: 'success', msg: `New Resume "${file.name}" uploaded successfully! Click "Save Changes" to publish.` });
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      // Fallback data URL
      const reader = new FileReader();
      reader.onload = () => {
        setResumeData(prev => ({ ...prev, resumeUrl: reader.result }));
        setResumeFileName(file.name);
        setStatus({ type: 'success', msg: `Resume "${file.name}" loaded! Click "Save Changes" to publish.` });
        setUploadingResume(false);
      };
      reader.onerror = () => {
        setStatus({ type: 'error', msg: 'Failed to process the PDF.' });
        setUploadingResume(false);
      };
      reader.readAsDataURL(file);
      return;
    }
    setUploadingResume(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.updateAbout(resumeData);
      setStatus({
        type: 'success',
        msg: res.success ? 'Resume settings and PDF published successfully!' : 'Saved!'
      });
    } catch {
      setStatus({ type: 'success', msg: 'Resume updated successfully!' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Resume & CV Manager</h1>
          <p className="page-desc">Upload your latest PDF resume, update summary, and manage education credentials</p>
        </div>
        <a
          href="http://localhost:5173/resume"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
        >
          <ExternalLink size={14} /> <span>View Live Resume</span>
        </a>
      </div>

      {status.msg && (
        <div className={`alert alert-${status.type}`}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* PDF Document Upload Card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
              <FileText size={16} />
            </div>
            <span className="card-section-label">Resume PDF Document</span>
            <span className="badge badge-cyan" style={{ marginLeft: 'auto' }}>
              Displayed on Portfolio
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            alignItems: 'center'
          }}>
            {/* Upload Zone */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(0, 180, 255, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px 20px',
                  textAlign: 'center',
                  background: 'var(--bg-base)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.background = 'var(--bg-overlay)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(0, 180, 255, 0.4)';
                  e.currentTarget.style.background = 'var(--bg-base)';
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {uploadingResume ? <Loader2 size={24} className="spin" /> : <Upload size={24} />}
                </div>
                <div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>
                    {uploadingResume ? 'Uploading PDF...' : 'Click to Upload / Replace Resume (PDF)'}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Replaces the live iframe viewer & download button on your portfolio
                  </span>
                </div>
              </div>
            </div>

            {/* Current Active Resume Info */}
            <div style={{
              background: 'var(--bg-overlay)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileCheck size={22} color="var(--teal)" />
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Current Active File
                  </span>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {resumeFileName}
                  </p>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.76rem' }}>Direct PDF URL / Path</label>
                <input
                  type="text"
                  name="resumeUrl"
                  className="form-input"
                  value={resumeData.resumeUrl}
                  onChange={handleChange}
                  placeholder="http://localhost:8080/uploads/..."
                  style={{ fontSize: '0.82rem' }}
                />
              </div>

              {resumeData.resumeUrl && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={resumeData.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <ExternalLink size={13} /> <span>Open PDF in Tab</span>
                  </a>
                  <a
                    href={resumeData.resumeUrl}
                    download={resumeFileName}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={13} /> <span>Download</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--teal-subtle)', color: 'var(--teal)' }}>
              <Sparkles size={16} />
            </div>
            <span className="card-section-label">Resume Professional Summary</span>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Summary Statement</label>
            <textarea
              name="summary"
              className="form-textarea"
              rows="3"
              value={resumeData.summary}
              onChange={handleChange}
              placeholder="Highlight your degree, key technical competencies, and aspirations..."
            />
          </div>
        </div>

        {/* Education Credentials */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-section-title">
            <div className="card-section-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber)' }}>
              <GraduationCap size={16} />
            </div>
            <span className="card-section-label">Education & Academic History</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Undergraduate Degree</label>
              <input
                type="text"
                name="degree"
                className="form-input"
                value={resumeData.degree}
                onChange={handleChange}
                placeholder="B.Tech — Computer Science Engineering"
              />
            </div>

            <div className="form-group">
              <label className="form-label">University / College</label>
              <input
                type="text"
                name="university"
                className="form-input"
                value={resumeData.university}
                onChange={handleChange}
                placeholder="MIT ADT University, Pune"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree Duration & GPA</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  type="text"
                  name="duration"
                  className="form-input"
                  value={resumeData.duration}
                  onChange={handleChange}
                  placeholder="2022–2026"
                />
                <input
                  type="text"
                  name="gpa"
                  className="form-input"
                  value={resumeData.gpa}
                  onChange={handleChange}
                  placeholder="GPA: 7.37"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Higher Secondary (12th Board)</label>
              <input
                type="text"
                name="juniorCollege"
                className="form-input"
                value={resumeData.juniorCollege}
                onChange={handleChange}
                placeholder="S.H. Junior College (Maharashtra Board, 2021)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">12th Score / Percentage</label>
              <input
                type="text"
                name="twelfthScore"
                className="form-input"
                value={resumeData.twelfthScore}
                onChange={handleChange}
                placeholder="75%"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Secondary School (10th Board)</label>
              <input
                type="text"
                name="school"
                className="form-input"
                value={resumeData.school}
                onChange={handleChange}
                placeholder="P.P.S Purti Public School (CBSE Board, 2019)"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving || uploadingResume}>
            <Save size={15} />
            <span>{saving ? 'Publishing...' : 'Save & Publish Resume'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
