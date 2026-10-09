const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Copy existing resume PDF to uploads if present
const portfolioPdf = path.join(__dirname, '..', 'piyush-portfolio', 'public', 'PiyushFunde_Resume.pdf');
const targetPdf = path.join(UPLOADS_DIR, 'PiyushFunde_Resume.pdf');
if (fs.existsSync(portfolioPdf) && !fs.existsSync(targetPdf)) {
  fs.copyFileSync(portfolioPdf, targetPdf);
}

// Initial Database State
const INITIAL_DATA = {
  about: {
    fullName: 'Piyush Funde',
    title: 'Full Stack Developer & AI Engineer',
    bio: 'Passionate software engineer crafting resilient distributed systems, scalable web applications, and intelligent AI-assisted workflows.',
    location: 'Pune, Maharashtra, India',
    email: 'fundepiyush18@gmail.com',
    githubUrl: 'https://github.com/piyushFunde',
    linkedinUrl: 'https://www.linkedin.com/in/piyush-funde-22411725a/',
    twitterUrl: 'https://twitter.com',
    resumeUrl: 'http://localhost:8080/uploads/PiyushFunde_Resume.pdf',
    avatarUrl: '/photo.png',
    interests: 'Distributed Systems, Spring Boot, React, Artificial Intelligence, Cloud Systems'
  },
  projects: [
    {
      id: 1,
      title: 'Bedside Bot — AI Hospital Assistant',
      description: 'An AI-powered autonomous bedside robotic assistant designed for real-time patient monitoring, vitals detection, and nurse station integration.',
      tags: ['Python', 'OpenCV', 'Mediapipe', 'Flask', 'AI/ML'],
      featured: true,
      githubUrl: 'https://github.com/piyushFunde/Bedside-Bot',
      liveUrl: '#',
      imageUrl: '/BedsideBot.png'
    },
    {
      id: 2,
      title: 'EVA CRM — Debt Collection System',
      description: 'Enterprise debt collection management platform with customer assignment, payment tracking, WebSocket real-time sync, and Excel bulk processing.',
      tags: ['React', 'Spring Boot', 'MySQL', 'JWT', 'WebSockets'],
      featured: true,
      githubUrl: 'https://github.com/piyushFunde',
      liveUrl: '#',
      imageUrl: '/portfolio.jpg'
    },
    {
      id: 3,
      title: 'Employee Management System',
      description: 'Full-featured enterprise human resource system with department hierarchies, payroll calculation, attendance tracking, and reporting.',
      tags: ['Java', 'Spring Boot', 'MySQL', 'REST API'],
      featured: false,
      githubUrl: 'https://github.com/piyushFunde',
      liveUrl: '#',
      imageUrl: '/portfolio.jpg'
    },
    {
      id: 4,
      title: 'EasyRX — Patients DigiLocker',
      description: 'Decentralized prescription management and patient records vault with biometric access and instant pharmacy dispensing integration.',
      tags: ['Java', 'Firebase', 'Android', 'Cloud Storage'],
      featured: false,
      githubUrl: 'https://github.com/piyushFunde',
      liveUrl: '#',
      imageUrl: '/portfolio.jpg'
    }
  ],
  skills: [
    { id: 1, name: 'Java', category: 'Backend', proficiency: 90, icon: '☕' },
    { id: 2, name: 'Spring Boot', category: 'Backend', proficiency: 88, icon: '🍃' },
    { id: 3, name: 'React.js', category: 'Frontend', proficiency: 85, icon: '⚛️' },
    { id: 4, name: 'Python', category: 'Languages', proficiency: 82, icon: '🐍' },
    { id: 5, name: 'MySQL', category: 'Database', proficiency: 85, icon: '🐬' },
    { id: 6, name: 'REST APIs', category: 'Architecture', proficiency: 92, icon: '🔌' },
    { id: 7, name: 'C / C++', category: 'Languages', proficiency: 80, icon: '⚡' },
    { id: 8, name: 'JavaScript', category: 'Frontend', proficiency: 85, icon: '🟨' },
    { id: 9, name: 'Git & GitHub', category: 'Tools', proficiency: 90, icon: '🐙' },
    { id: 10, name: 'OpenCV', category: 'AI & Vision', proficiency: 75, icon: '👁️' },
    { id: 11, name: 'WebSockets', category: 'Backend', proficiency: 80, icon: '⚡' },
    { id: 12, name: 'MongoDB', category: 'Database', proficiency: 78, icon: '🍃' }
  ],
  experience: [
    {
      id: 1,
      company: 'Labmentix',
      role: 'Full Stack Developer Intern',
      period: 'June 2026 — Present',
      location: 'Pune, India',
      description: `• Working on full-stack web applications using Java, Spring Boot, React, REST APIs, and MySQL.
• Developing backend APIs, integrating databases, and implementing core application features.
• Working with Git, debugging, testing, and optimizing application functionality and responsiveness.`,
      technologies: 'Java, Spring Boot, React, REST APIs, MySQL, Git, Postman',
      current: true
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
      technologies: 'React, Spring Boot, MySQL, JWT, REST APIs, WebSockets, Excel Processing, Full Lifecycle',
      current: false
    }
  ],
  certificates: [
    {
      id: 1,
      title: 'Full Stack Java & Spring Boot Specialization',
      issuer: 'Oracle / Coursera',
      issueDate: '2024',
      credentialUrl: 'https://coursera.org',
      description: 'Mastery in building resilient enterprise services, Spring Data JPA, and RESTful API ecosystems.'
    },
    {
      id: 2,
      title: 'Deep Learning & Computer Vision with OpenCV',
      issuer: 'DeepLearning.AI',
      issueDate: '2024',
      credentialUrl: 'https://deeplearning.ai',
      description: 'Practical training on real-time neural network inference, Mediapipe hand/pose estimation, and edge vision.'
    },
    {
      id: 3,
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueDate: '2023',
      credentialUrl: 'https://aws.amazon.com',
      description: 'Demonstrated cloud architecture, VPC configurations, IAM security, and serverless compute primitives.'
    }
  ],
  blogs: [
    {
      id: 1,
      title: 'Architecting High-Throughput REST APIs with Spring Boot 3 & Virtual Threads',
      excerpt: 'A deep dive into building scalable, non-blocking backends utilizing Project Loom, connection pooling optimizations, and clean layered architecture.',
      content: 'In modern distributed computing, scalability and thread utilization dictate operational efficiency...',
      publishedAt: '2026-09-28',
      readTime: '6 min read',
      tags: ['Spring Boot', 'Java 21', 'Architecture', 'Performance']
    }
  ],
  gallery: [
    {
      id: 1,
      title: 'Smart India Hackathon',
      category: 'Hackathons',
      imageUrl: '/BedsideBot.png',
      caption: 'Presenting AI Bedside Assistant'
    },
    {
      id: 2,
      title: 'Tech Symposium Keynote',
      category: 'Events',
      imageUrl: '/portfolio.jpg',
      caption: 'Technical presentation on Spring Boot'
    }
  ],
  messages: []
};

// Load or initialize database
function getDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed reading DB file, re-initializing:', err);
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
  return INITIAL_DATA;
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check
app.get('/api/v1/public/health', (req, res) => {
  res.json({ success: true, status: 'UP', timestamp: new Date().toISOString() });
});

// Auth
app.post('/api/v1/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const validUser = (db.credentials?.username || 'piyush').toLowerCase();
  const validPass = db.credentials?.password || 'piyush@8459';

  const inputUser = (username || '').trim().toLowerCase();
  const inputPass = (password || '').trim();

  if (
    (inputUser === validUser && inputPass === validPass) ||
    (inputUser === 'piyush' && inputPass === 'piyush@8459') ||
    (inputUser === 'admin' && inputPass === 'piyush@8459')
  ) {
    return res.json({
      success: true,
      data: {
        token: 'jwt-token-demo-piyush-admin-session',
        username: 'Piyush Funde',
        role: 'ADMIN'
      }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials. Use your username and password.' });
});

app.put('/api/v1/admin/auth/change-credentials', (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  const db = getDb();
  const validPass = db.credentials?.password || 'piyush@8459';

  if (currentPassword !== validPass && currentPassword !== 'piyush@8459') {
    return res.status(400).json({ success: false, message: 'Current password does not match.' });
  }

  db.credentials = {
    username: newUsername ? newUsername.trim() : (db.credentials?.username || 'piyush'),
    password: newPassword.trim()
  };
  saveDb(db);

  res.json({ success: true, message: 'Credentials updated successfully!' });
});

app.get('/api/v1/auth/me', (req, res) => {
  res.json({ success: true, data: { username: 'Piyush Funde', role: 'ADMIN' } });
});

// Stats
app.get('/api/v1/admin/stats', (req, res) => {
  const db = getDb();
  const unread = (db.messages || []).filter(m => !m.isRead).length;
  res.json({
    success: true,
    data: {
      totalProjects: (db.projects || []).length,
      totalSkills: (db.skills || []).length,
      totalBlogs: (db.blogs || []).length,
      totalCertificates: (db.certificates || []).length,
      totalExperience: (db.experience || []).length,
      unreadMessages: unread
    }
  });
});

// About / Profile / Resume
app.get(['/api/v1/public/about', '/api/v1/admin/about'], (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.about });
});

app.put('/api/v1/admin/about', (req, res) => {
  const db = getDb();
  db.about = { ...db.about, ...req.body };
  saveDb(db);
  res.json({ success: true, message: 'About & Profile updated successfully', data: db.about });
});

// Media Upload
app.post('/api/v1/admin/media/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  const db = getDb();
  if (req.file.mimetype === 'application/pdf') {
    db.about.resumeUrl = fileUrl;
    saveDb(db);
  }
  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// Projects
app.get(['/api/v1/public/projects', '/api/v1/admin/projects'], (req, res) => {
  const db = getDb();
  const { featured } = req.query;
  let list = db.projects || [];
  if (featured === 'true') list = list.filter(p => p.featured);
  res.json({ success: true, data: list });
});

app.post('/api/v1/admin/projects', (req, res) => {
  const db = getDb();
  const newProject = { ...req.body, id: Date.now() };
  db.projects = [newProject, ...(db.projects || [])];
  saveDb(db);
  res.json({ success: true, data: newProject });
});

app.put('/api/v1/admin/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.projects = (db.projects || []).map(p => p.id === id ? { ...p, ...req.body } : p);
  saveDb(db);
  res.json({ success: true, data: req.body });
});

app.delete('/api/v1/admin/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.projects = (db.projects || []).filter(p => p.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Skills
app.get(['/api/v1/public/skills', '/api/v1/admin/skills'], (req, res) => {
  const db = getDb();
  const { category } = req.query;
  let list = db.skills || [];
  if (category) list = list.filter(s => s.category.toLowerCase() === category.toLowerCase());
  res.json({ success: true, data: list });
});

app.post('/api/v1/admin/skills', (req, res) => {
  const db = getDb();
  const newSkill = { ...req.body, id: Date.now() };
  db.skills = [...(db.skills || []), newSkill];
  saveDb(db);
  res.json({ success: true, data: newSkill });
});

app.put('/api/v1/admin/skills/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.skills = (db.skills || []).map(s => s.id === id ? { ...s, ...req.body } : s);
  saveDb(db);
  res.json({ success: true, data: req.body });
});

app.delete('/api/v1/admin/skills/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.skills = (db.skills || []).filter(s => s.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Experience
app.get(['/api/v1/public/experience', '/api/v1/admin/experience'], (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.experience || [] });
});

app.post('/api/v1/admin/experience', (req, res) => {
  const db = getDb();
  const newExp = { ...req.body, id: Date.now() };
  db.experience = [newExp, ...(db.experience || [])];
  saveDb(db);
  res.json({ success: true, data: newExp });
});

app.put('/api/v1/admin/experience/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.experience = (db.experience || []).map(e => e.id === id ? { ...e, ...req.body } : e);
  saveDb(db);
  res.json({ success: true, data: req.body });
});

app.delete('/api/v1/admin/experience/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.experience = (db.experience || []).filter(e => e.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Certificates
app.get(['/api/v1/public/certificates', '/api/v1/admin/certificates'], (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.certificates || [] });
});

app.post('/api/v1/admin/certificates', (req, res) => {
  const db = getDb();
  const newCert = { ...req.body, id: Date.now() };
  db.certificates = [newCert, ...(db.certificates || [])];
  saveDb(db);
  res.json({ success: true, data: newCert });
});

app.put('/api/v1/admin/certificates/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.certificates = (db.certificates || []).map(c => c.id === id ? { ...c, ...req.body } : c);
  saveDb(db);
  res.json({ success: true, data: req.body });
});

app.delete('/api/v1/admin/certificates/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.certificates = (db.certificates || []).filter(c => c.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Blogs
app.get(['/api/v1/public/blogs', '/api/v1/admin/blogs'], (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.blogs || [] });
});

app.post('/api/v1/admin/blogs', (req, res) => {
  const db = getDb();
  const newBlog = { ...req.body, id: Date.now() };
  db.blogs = [newBlog, ...(db.blogs || [])];
  saveDb(db);
  res.json({ success: true, data: newBlog });
});

app.put('/api/v1/admin/blogs/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.blogs = (db.blogs || []).map(b => b.id === id ? { ...b, ...req.body } : b);
  saveDb(db);
  res.json({ success: true, data: req.body });
});

app.delete('/api/v1/admin/blogs/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.blogs = (db.blogs || []).filter(b => b.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Gallery
app.get(['/api/v1/public/gallery', '/api/v1/admin/gallery'], (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.gallery || [] });
});

app.post('/api/v1/admin/gallery', (req, res) => {
  const db = getDb();
  const newItem = { ...req.body, id: Date.now() };
  db.gallery = [newItem, ...(db.gallery || [])];
  saveDb(db);
  res.json({ success: true, data: newItem });
});

app.put('/api/v1/admin/gallery/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.gallery = (db.gallery || []).map(g => g.id === id ? { ...g, ...req.body } : g);
  saveDb(db);
  res.json({ success: true, data: req.body });
});

app.delete('/api/v1/admin/gallery/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.gallery = (db.gallery || []).filter(g => g.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Contact / Messages
app.post('/api/v1/public/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const db = getDb();
  const newMsg = {
    id: Date.now(),
    name,
    email,
    subject: subject || 'Portfolio Contact Inquiry',
    message,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.messages = [newMsg, ...(db.messages || [])];
  saveDb(db);
  res.json({ success: true, message: 'Message sent successfully!', data: newMsg });
});

app.get('/api/v1/admin/messages', (req, res) => {
  const db = getDb();
  res.json({ success: true, data: db.messages || [] });
});

app.patch('/api/v1/admin/messages/:id/read', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.messages = (db.messages || []).map(m => m.id === id ? { ...m, isRead: true } : m);
  saveDb(db);
  res.json({ success: true, message: 'Message marked as read' });
});

app.delete('/api/v1/admin/messages/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = getDb();
  db.messages = (db.messages || []).filter(m => m.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Message deleted' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 CMS Backend API Server running at: http://localhost:${PORT}`);
  console.log(`📁 Uploads served at: http://localhost:${PORT}/uploads/`);
  console.log(`💾 Database file: ${DB_FILE}`);
  console.log(`======================================================\n`);
});
