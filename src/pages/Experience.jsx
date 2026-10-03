import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { portfolioApi } from '../api';

const DEFAULT_EXPERIENCES = [
  {
    id: 1,
    company: 'Labmentix',
    role: 'Full Stack Developer Intern',
    period: 'June 2026 — Present',
    location: 'Pune, India',
    description: `• Working on full-stack web applications using Java, Spring Boot, React, REST APIs, and MySQL.
• Developing backend APIs, integrating databases, and implementing core application features.
• Working with Git, debugging, testing, and optimizing application functionality and responsiveness.`,
    technologies: 'Java, Spring Boot, React, REST APIs, MySQL, Git, Postman'
  },
  {
    id: 2,
    company: 'EVA Groups',
    role: 'Freelance Full Stack Developer',
    period: 'March 2026 — June 2026',
    location: 'Pune, India (Remote)',
    description: `• Built EVA CRM, a production collection management system actively used by real-world users.
• Developed the application end-to-end using React, Spring Boot, MySQL, JWT, and REST APIs.
• Implemented customer assignment, payment/collection tracking, receipt uploads, Excel data import, and role-based access control.
• Added offline support and real-time synchronization using WebSockets.
• Handled full-cycle development, deployment, and client requirements independently.`,
    technologies: 'React, Spring Boot, MySQL, JWT, REST APIs, WebSockets, Excel Processing, Full Lifecycle'
  }
];

export default function Experience() {
  const [experiences, setExperiences] = useState(DEFAULT_EXPERIENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await portfolioApi.getExperience(DEFAULT_EXPERIENCES);
        if (data && Array.isArray(data) && data.length > 0) {
          setExperiences(data);
        }
      } catch {
        setExperiences(DEFAULT_EXPERIENCES);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 50 }}
      >
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 20,
          background: 'rgba(0, 180, 255, 0.1)',
          border: '1px solid rgba(0, 180, 255, 0.25)',
          color: 'var(--accent)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: 14
        }}>
          <Sparkles size={14} /> Career & Journey
        </span>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.02em',
          marginBottom: 12
        }}>
          Work Experience
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 540, margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
          My professional background, production client projects, and engineering experience.
        </p>
      </motion.div>

      {/* Timeline */}
      <div style={{ maxWidth: 840, margin: '0 auto', position: 'relative', padding: '10px 0' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: 28,
          top: 24,
          bottom: 24,
          width: 2,
          background: 'linear-gradient(to bottom, var(--accent) 0%, rgba(0, 180, 255, 0.3) 70%, rgba(255,255,255,0.05) 100%)',
          borderRadius: 1
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {experiences.map((exp, idx) => {
            const techList = exp.technologies
              ? (Array.isArray(exp.technologies) ? exp.technologies : exp.technologies.split(',').map(t => t.trim()))
              : [];

            const isPresent = (exp.period || '').toLowerCase().includes('present');

            return (
              <motion.div
                key={exp.id || idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                style={{
                  display: 'flex',
                  gap: 24,
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                {/* Timeline node */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: isPresent ? 'rgba(0, 180, 255, 0.15)' : '#0d1117',
                  border: isPresent ? '2px solid var(--accent)' : '2px solid rgba(0, 180, 255, 0.4)',
                  boxShadow: isPresent ? '0 0 20px rgba(0, 180, 255, 0.4)' : '0 0 10px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isPresent ? 'var(--accent)' : '#94a3b8',
                  flexShrink: 0,
                  zIndex: 2,
                  marginTop: 2
                }}>
                  <Briefcase size={22} />
                </div>

                {/* Content Card */}
                <motion.div
                  whileHover={{ y: -4, borderColor: 'rgba(0, 180, 255, 0.4)' }}
                  style={{
                    flex: 1,
                    background: 'rgba(15, 18, 28, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 16,
                    padding: '28px 32px',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.2s ease, transform 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginBottom: 12
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                          {exp.role}
                        </h3>
                        {isPresent && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 12,
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            letterSpacing: '0.04em'
                          }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--accent)', marginTop: 4 }}>
                        {exp.company}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      {exp.period && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: '0.82rem',
                          color: '#e2e8f0',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '5px 12px',
                          borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          <Calendar size={13} color="var(--accent)" />
                          {exp.period}
                        </span>
                      )}
                      {exp.location && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.8rem',
                          color: 'var(--muted)'
                        }}>
                          <MapPin size={13} />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bullet points description */}
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '0.92rem',
                    lineHeight: 1.75,
                    margin: '16px 0 20px',
                    whiteSpace: 'pre-line'
                  }}>
                    {exp.description}
                  </div>

                  {/* Technology Pills */}
                  {techList.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      paddingTop: 14,
                      borderTop: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {techList.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            padding: '4px 11px',
                            borderRadius: 6,
                            background: 'rgba(0, 180, 255, 0.08)',
                            border: '1px solid rgba(0, 180, 255, 0.2)',
                            color: '#93c5fd'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
