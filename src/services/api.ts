import axios from 'axios';
import { Issue, Authority } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('authority');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (data: {
        name: string;
        email: string;
        password: string;
        phone: string;
        city: string;
        municipalityType: 'Municipal Corporation' | 'Municipal Council' | 'Nagar Panchayat';
    }) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getMe: async (): Promise<Authority> => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Issues API
export const issuesAPI = {
    getAll: async (filters?: {
        status?: string;
        category?: string;
        city?: string;
    }): Promise<Issue[]> => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.city) params.append('city', filters.city);

        const response = await api.get(`/issues?${params.toString()}`);
        return response.data;
    },

    getById: async (id: string): Promise<Issue> => {
        const response = await api.get(`/issues/${id}`);
        return response.data;
    },

    create: async (issueData: {
        title: string;
        description: string;
        category: string;
        location: {
            address: string;
            ward: string;
            city: string;
            lat: number;
            lng: number;
        };
        reporter: {
            name: string;
            phone: string;
        };
        images?: string[];
    }) => {
        const response = await api.post('/issues', issueData);
        return response.data;
    },

    updateStatus: async (
        id: string,
        data: {
            status: string;
            assignedDepartment?: string;
            assignedOfficerName?: string;
            notes?: string;
        }
    ) => {
        const response = await api.put(`/issues/${id}/status`, data);
        return response.data;
    },

    getAnalytics: async () => {
        const response = await api.get('/issues/analytics');
        return response.data;
    },
};

export default api;
