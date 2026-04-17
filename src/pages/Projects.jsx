import React from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'

const PROJECTS = [
  {
    title: '🩺 Bedside Bot',
    desc: 'AI-powered hospital assistant designed to help bedridden patients using real-time gesture recognition, voice commands, and emotion detection. The system reduces patient wait time by enabling hands-free interaction with hospital services through an intelligent and responsive interface.',
    ss: '/BedsideBot.png',
    tech: ['Python', 'Flask', 'OpenCV', 'Mediapipe', 'DeepFace', 'SpeechRecognition'],
    live: '#',
    code: 'https://github.com/piyushFunde/Bedsidebot_app'
  },
  {
    title: '⚙️ Visual Pipeline Engine',
    desc: 'Drag-and-drop pipeline builder that allows users to create, validate, and execute Directed Acyclic Graph (DAG)-based workflows. The system supports multiple node types like API, Database, LLM, and Condition nodes, with real-time validation, persistence, and simulated execution to streamline workflow automation',
    ss: '/VisualPipelineEngine.png',
    tech: ['React', 'React Flow', 'Zustand', 'Java', 'Spring Boot', 'Spring Data JPA', 'H2 Database', 'Maven'],
    live: '#',
    code: 'https://github.com/piyushFunde/Visual-Pipeline-Engine'
  },
  {
    title: '🐞 BugFix AI',
    desc: 'AI-powered bug analysis and fix suggestion system that automatically analyzes bug reports from issue trackers, understands error context, and generates intelligent code-fix recommendations for developers. The system improves debugging speed, reduces manual effort, and enhances development productivity through automated AI-assisted debugging.',
    ss: '/BugFixAI.png',
    tech: ['Java', 'Spring Boot', 'REST API', 'AI/LLM', 'Jira Webhooks', 'PostgreSQL', 'Maven'],
    live: 'https://bugfix-ai-backend-odli.onrender.com/',
    code: 'https://github.com/piyushFunde/BugFix-Ai'
  },
  {
  title: '💰 Expense Tracker',
  desc: 'A desktop-based expense tracking application that helps users record, categorize, and analyze their financial spending. The system provides interactive insights, automated data import, and secure handling of sensitive financial data.',
  ss: '/expense.png',
  tech: ['Python', 'Tkinter', 'SQLite'],
  live: '#',
  code: 'https://github.com/piyushFunde/expense-tracker'
  },
  {
  title: '👨‍💼 Employee Management System',
  desc: 'A Java-based employee and payroll management system that demonstrates strong Object-Oriented Programming principles. The application provides a user-friendly GUI for managing employee records and integrates with a MySQL database for secure and persistent data storage.',
  ss: '/ems.jpg',
  tech: ['Java', 'OOP', 'Swing', 'MySQL', 'JDBC'],
  live: '#',
  code: 'https://github.com/piyushFunde/EmpMS'
  },
  {
  title: '💼 Portfolio Website',
  desc: 'A modern and responsive portfolio built with React and Framer Motion, showcasing projects, skills, and achievements with smooth animations and interactive UI.',
  ss: '/portfolio.jpg',
  tech: ['React', 'Framer Motion', 'Vanilla CSS', 'Vite'],
  live: '#',
  code: 'https://github.com/piyushFunde/Piyush-Portfolio'
  },
]

export default function Projects() {
  return (
    <motion.section
      className="container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      id="projects"
    >
      <div className="card" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 30 }}>
        <motion.h2
          style={{ fontSize: '2rem', fontWeight: 600, color: '#00b4ff', marginBottom: '0.5rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          🚀 Projects
        </motion.h2>
        <p style={{ color: '#9aa0a6', marginBottom: '2.5rem' }}>
          A collection of my major works — blending research, AI innovation.
        </p>

        <div className="projects-grid" style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {PROJECTS.map((p, idx) => (
            <motion.div
              key={idx}
              className="project-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              style={{
                background: 'linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.9))',
                border: '1px solid rgba(0,255,255,0.1)',
                borderRadius: 16,
                padding: 16,
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(0,255,255,0.08)'
              }}
            >
              <motion.div className="ss" whileHover={{ scale: 1.05 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
                <img
                  src={p.ss}
                  alt={p.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: 12
                  }}
                />
              </motion.div>

              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontSize: 18, color: '#0ea5e9', marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#bbb', marginBottom: 8, lineHeight: 1.6 }}>{p.desc}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: 'rgba(0,255,255,0.05)',
                        border: '1px solid rgba(0,255,255,0.1)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        color: '#aaf'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <motion.a
                    href={p.code}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    whileHover={{ scale: 1.08 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'rgba(255,255,255,0.05)',
                      color: '#0ea5e9',
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      border: '1px solid rgba(0,255,255,0.1)',
                      textDecoration: 'none'
                    }}
                  >
                    <Github size={14} /> Code
                  </motion.a>
                  <motion.a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    whileHover={{ scale: 1.08 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'linear-gradient(90deg, #06b6d4, #0891b2)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} /> Live
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
