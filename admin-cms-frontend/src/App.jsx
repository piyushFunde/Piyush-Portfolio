import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AboutEditor from './pages/AboutEditor';
import ResumeManager from './pages/ResumeManager';
import ProjectsManager from './pages/ProjectsManager';
import SkillsManager from './pages/SkillsManager';
import ExperienceManager from './pages/ExperienceManager';
import CertificatesManager from './pages/CertificatesManager';
import BlogsManager from './pages/BlogsManager';
import GalleryManager from './pages/GalleryManager';
import MessagesManager from './pages/MessagesManager';
import { getAuthToken, api } from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleUnauthorized = () => setIsAuthenticated(false);
    window.addEventListener('cms:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('cms:unauthorized', handleUnauthorized);
  }, []);

  const refreshStats = async () => {
    try {
      const res = await api.getMessages();
      if (res && res.success && Array.isArray(res.data)) {
        const unread = res.data.filter(m => !m.isRead).length;
        setUnreadCount(unread);
      } else {
        setUnreadCount(0);
      }
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (isAuthenticated) refreshStats();
  }, [isAuthenticated]);

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/login') {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-layout">
      <div className="ambient-blob-1" />
      <div className="ambient-blob-2" />

      <Sidebar unreadCount={unreadCount} />

      <div className="main-wrapper">
        <Navbar username="Piyush" />
        <main className="main-content" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<AboutEditor />} />
            <Route path="/resume" element={<ResumeManager />} />
            <Route path="/projects" element={<ProjectsManager />} />
            <Route path="/skills" element={<SkillsManager />} />
            <Route path="/experience" element={<ExperienceManager />} />
            <Route path="/certificates" element={<CertificatesManager />} />
            <Route path="/blogs" element={<BlogsManager />} />
            <Route path="/gallery" element={<GalleryManager />} />
            <Route path="/messages" element={<MessagesManager onMessagesUpdated={refreshStats} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
