const API_BASE_URL = 'http://localhost:8080/api/v1/public';

async function fetchFromCms(endpoint, fallbackData = null) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return fallbackData;
  } catch (err) {
    console.warn(`CMS API offline or unreachable for ${endpoint}, using static cache.`, err);
    return fallbackData;
  }
}

export const portfolioApi = {
  getAbout: (fallback) => fetchFromCms('/about', fallback),
  getProjects: (featuredOnly = false, fallback) => fetchFromCms(`/projects${featuredOnly ? '?featured=true' : ''}`, fallback),
  getSkills: (category = '', fallback) => fetchFromCms(`/skills${category ? `?category=${category}` : ''}`, fallback),
  getExperience: (fallback) => fetchFromCms('/experience', fallback),
  getCertificates: (fallback) => fetchFromCms('/certificates', fallback),
  getBlogs: (fallback) => fetchFromCms('/blogs', fallback),
  getGallery: (fallback) => fetchFromCms('/gallery', fallback),
  
  submitContact: async (contactData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend contact API unavailable:', err);
      return { success: false, message: 'Could not connect to backend server' };
    }
  }
};
