import axios from 'axios';

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api`;
    }
  }
  return envUrl || 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password });

// AI Generate (streaming)
export const generateStream = async (
  payload: { tool: string; prompt: string; language: string; tone: string; finalPrompt: string },
  token: string,
  onChunk: (text: string) => void,
  onDone: () => void
) => {
  const response = await fetch(`${API_BASE}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = 'Failed to generate content.';
    try {
      const parsed = JSON.parse(text);
      errorMessage = parsed.error || errorMessage;
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Empty response from generation API.');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    for (const line of lines) {
      const trimmed = line.replace(/^data: /, '').trim();
      if (!trimmed || trimmed === '[DONE]') {
        if (trimmed === '[DONE]') onDone();
        continue;
      }
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.content) onChunk(parsed.content);
      } catch {
        // skip
      }
    }
  }
  onDone();
};

// History
export const getHistory = () => api.get('/history');
export const deleteHistory = (id: string) => api.delete(`/history/${id}`);

// Save history
export const saveHistory = (data: {
  prompt: string;
  response: string;
  toolUsed: string;
  language: string;
  tone: string;
}) => api.post('/ai/save-history', data);
