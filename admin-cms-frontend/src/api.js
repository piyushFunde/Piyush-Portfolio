const API_BASE_URL = 'http://localhost:8080/api/v1';

export const getAuthToken = () => localStorage.getItem('cms_token');
export const setAuthToken = (token) => localStorage.setItem('cms_token', token);
export const removeAuthToken = () => localStorage.removeItem('cms_token');

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      removeAuthToken();
      window.dispatchEvent(new CustomEvent('cms:unauthorized'));
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn(`API request to ${endpoint} failed:`, error);
    throw error;
  }
}

// API Methods
export const api = {
  // Health
  getHealth: () => request('/public/health'),

  // Auth
  login: (username, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  getMe: () => request('/auth/me'),

  // Stats
  getStats: () => request('/admin/stats'),

  // About
  getAbout: () => request('/public/about'),
  updateAbout: (data) => request('/admin/about', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Projects
  getProjects: () => request('/admin/projects'),
  createProject: (data) => request('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateProject: (id, data) => request(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteProject: (id) => request(`/admin/projects/${id}`, {
    method: 'DELETE'
  }),

  // Skills
  getSkills: () => request('/admin/skills'),
  createSkill: (data) => request('/admin/skills', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateSkill: (id, data) => request(`/admin/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteSkill: (id) => request(`/admin/skills/${id}`, {
    method: 'DELETE'
  }),

  // Experience
  getExperience: () => request('/admin/experience'),
  createExperience: (data) => request('/admin/experience', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateExperience: (id, data) => request(`/admin/experience/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteExperience: (id) => request(`/admin/experience/${id}`, {
    method: 'DELETE'
  }),

  // Certificates
  getCertificates: () => request('/admin/certificates'),
  createCertificate: (data) => request('/admin/certificates', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCertificate: (id, data) => request(`/admin/certificates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteCertificate: (id) => request(`/admin/certificates/${id}`, {
    method: 'DELETE'
  }),

  // Blogs
  getBlogs: () => request('/admin/blogs'),
  createBlog: (data) => request('/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateBlog: (id, data) => request(`/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteBlog: (id) => request(`/admin/blogs/${id}`, {
    method: 'DELETE'
  }),

  // Gallery
  getGallery: () => request('/admin/gallery'),
  createGalleryItem: (data) => request('/admin/gallery', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateGalleryItem: (id, data) => request(`/admin/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteGalleryItem: (id) => request(`/admin/gallery/${id}`, {
    method: 'DELETE'
  }),

  // Messages
  getMessages: () => request('/admin/messages'),
  markMessageRead: (id) => request(`/admin/messages/${id}/read`, {
    method: 'PATCH'
  }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, {
    method: 'DELETE'
  }),

  // Media Upload
  uploadMedia: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/admin/media/upload', {
      method: 'POST',
      body: formData
    });
  },
  getMedia: () => request('/admin/media')
};
