// ===== API Layer — fetch-based with JWT =====
const API_BASE = '/api';

async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '#/login';
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        let detail = 'Request failed';
        try { const data = await res.json(); detail = data.detail || detail; } catch { }
        throw new Error(detail);
    }
    if (res.status === 204) return null;
    return res.json();
}

// Auth API
const authAPI = {
    signup: (data) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => apiFetch('/auth/me'),
};

// Resume API
const resumeAPI = {
    upload: (file) => {
        const fd = new FormData();
        fd.append('file', file);
        return apiFetch('/resumes/upload', { method: 'POST', body: fd });
    },
    getMyResume: () => apiFetch('/resumes/me'),
};

// Jobs API
const jobsAPI = {
    create: (data) => apiFetch('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    list: () => apiFetch('/jobs'),
    get: (id) => apiFetch(`/jobs/${id}`),
    delete: (id) => apiFetch(`/jobs/${id}`, { method: 'DELETE' }),
};

// Matching API
const matchingAPI = {
    getMatches: (jobId) => apiFetch(`/jobs/${jobId}/matches`),
    searchCandidates: (query, topK = 10) => apiFetch(`/search/candidates?q=${encodeURIComponent(query)}&top_k=${topK}`),
};

// Dashboard API
const dashboardAPI = {
    getStats: () => apiFetch('/dashboard/stats'),
};

window.api = { authAPI, resumeAPI, jobsAPI, matchingAPI, dashboardAPI };
