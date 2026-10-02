import type { AuthResponse, LearningProgress, Activity, Practice, DashboardData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await response.json().catch(() => ({ message: 'Invalid response from server' }));

  if (!response.ok) {
    if (response.status === 401 && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/register')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const authAPI = {
  register: (data: { username: string; email: string; password: string; confirmPassword: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request<AuthResponse>('/auth/logout', { method: 'POST' }),
  forgotPassword: (data: { email: string }) =>
    request<AuthResponse>('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  verifyOTP: (data: { email: string; otp: string }) =>
    request<AuthResponse & { resetToken?: string }>('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data: { email: string; newPassword: string; resetToken?: string }) =>
    request<AuthResponse>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request<{ success: boolean; user: any }>('/users/profile'),
};

export const progressAPI = {
  getAll: () => request<{ success: boolean; progress: LearningProgress[] }>('/progress'),
  getByTopic: (topic: string) => request<{ success: boolean; progress: LearningProgress }>(`/progress/${topic}`),
  save: (data: Partial<LearningProgress>) =>
    request<{ success: boolean; progress: LearningProgress }>('/progress', { method: 'POST', body: JSON.stringify(data) }),
};

export const activityAPI = {
  record: (data: Partial<Activity>) =>
    request<{ success: boolean; activity: Activity }>('/activity', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => request<{ success: boolean; activities: Activity[] }>('/activity'),
};

export const practiceAPI = {
  submit: (data: Partial<Practice>) =>
    request<{ success: boolean; practice: Practice }>('/practice', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => request<{ success: boolean; practices: Practice[] }>('/practice'),
};

export const dashboardAPI = {
  get: () => request<{ success: boolean; dashboard: DashboardData }>('/dashboard'),
};

export const assistantAPI = {
  getStatus: () =>
    request<{
      success: boolean;
      available: boolean;
      models: string[];
      configuredModel: string;
      hasConfiguredModel: boolean;
    }>('/assistant/status'),
  chat: (data: { message: string; topic: string; history?: { sender: string; text: string }[] }) =>
    request<{
      success: boolean;
      answer?: string;
      source?: string;
      model?: string;
      error?: string;
    }>('/assistant/chat', { method: 'POST', body: JSON.stringify(data) }),
};

