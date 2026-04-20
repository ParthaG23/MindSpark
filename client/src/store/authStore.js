import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('mindspark-user')) || null,
  isLoading: false,
  error: null,

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('mindspark-user', JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Login
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('mindspark-user', JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    }
    localStorage.removeItem('mindspark-user');
    set({ user: null, error: null });
  },

  // Fetch current user
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('mindspark-user', JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
    } catch {
      localStorage.removeItem('mindspark-user');
      set({ user: null, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
