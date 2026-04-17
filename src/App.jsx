import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Gallery from './pages/Gallery'
import Certificates from './pages/Certificates'
import Blog from './pages/Blog'
import Resume from './pages/Resume'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import SkillNetwork from './pages/Skills'  

const pageTitles = {
  '/': 'Piyush Funde | Home',
  '/projects': 'Piyush Funde | Projects',
  '/gallery': 'Piyush Funde | Gallery',
  '/skills': 'Piyush Funde | Skills',
  '/certificates': 'Piyush Funde | Certificates',
  '/blog': 'Piyush Funde | Blog',
  '/resume': 'Piyush Funde | Resume',
  '/about': 'Piyush Funde | About',
  '/contact': 'Piyush Funde | Contact',
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    document.title = pageTitles[location.pathname] ?? 'Piyush Funde | Portfolio'
  }, [location.pathname])

  return (
    <div className="app">
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/skills" element={<SkillNetwork />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/about" element={<About />} /> {/* ✅ fixed lowercase */}
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} Piyush Funde — Built with React
      </footer>
    </div>
  )
}
