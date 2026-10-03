import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import CursorEffect from './components/CursorEffect'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Gallery from './pages/Gallery'
import Certificates from './pages/Certificates'
import Blog from './pages/Blog'
import Resume from './pages/Resume'
import About from './pages/About'
import Contact from './pages/Contact'
import Experience from './pages/Experience'
import NotFound from './pages/NotFound'
import SkillNetwork from './pages/Skills'
import { Shield, Sparkles } from 'lucide-react'

const CMS_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'

const pageTitles = {
  '/': 'Piyush Funde | Home',
  '/projects': 'Piyush Funde | Projects',
  '/experience': 'Piyush Funde | Experience',
  '/gallery': 'Piyush Funde | Gallery',
  '/skills': 'Piyush Funde | Skills',
  '/certificates': 'Piyush Funde | Certificates',
  '/blog': 'Piyush Funde | Blog',
  '/resume': 'Piyush Funde | Resume',
  '/about': 'Piyush Funde | About',
  '/contact': 'Piyush Funde | Contact',
}

function AdminRedirect() {
  useEffect(() => {
    window.location.href = CMS_ADMIN_URL
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--accent)' }}>
      <h2>Redirecting to Custom CMS Admin Portal...</h2>
      <p style={{ color: 'var(--muted)', marginTop: 8 }}>Please wait or <a href={CMS_ADMIN_URL} style={{ color: '#fff' }}>click here</a>.</p>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    document.title = pageTitles[location.pathname] ?? 'Piyush Funde | Portfolio'
  }, [location.pathname])

  // Global hotkey: Ctrl + Shift + A opens CMS
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        window.open(CMS_ADMIN_URL, '_blank')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="app">
      <CursorEffect />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/skills" element={<SkillNetwork />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px' }}>
        <span>© {new Date().getFullYear()} Piyush Funde — Built with React</span>
        <a
          href={CMS_ADMIN_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            color: 'var(--muted)',
            textDecoration: 'none',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'rgba(79,142,255,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
          title="Access CMS Control Center (or press Ctrl + Shift + A)"
        >
          <Shield size={12} />
          <span>CMS Portal</span>
        </a>
      </footer>
    </div>
  )
}
