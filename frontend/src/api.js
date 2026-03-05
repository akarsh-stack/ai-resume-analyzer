import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

// Resume API
export const resumeAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/resumes/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getMyResume: () => api.get('/resumes/me'),
};

// Jobs API
export const jobsAPI = {
    create: (data) => api.post('/jobs', data),
    list: () => api.get('/jobs'),
    get: (id) => api.get(`/jobs/${id}`),
    delete: (id) => api.delete(`/jobs/${id}`),
};

// Matching API
export const matchingAPI = {
    getMatches: (jobId) => api.get(`/jobs/${jobId}/matches`),
    searchCandidates: (query, topK = 10) =>
        api.get('/search/candidates', { params: { q: query, top_k: topK } }),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
};

export default api;
