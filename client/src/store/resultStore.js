import { create } from 'zustand';
import api from '../api/axios';

const useResultStore = create((set) => ({
  myResults: [],
  currentResult: null,
  leaderboard: [],
  studentStats: null,
  quizResults: null,
  isLoading: false,
  error: null,

  // Fetch student's own results
  fetchMyResults: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/results/my-results');
      set({ myResults: data.results, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch results', isLoading: false });
    }
  },

  // Fetch a single result by ID
  fetchResultById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/results/${id}`);
      set({ currentResult: data.result, isLoading: false });
      return data.result;
    } catch {
      set({ error: 'Failed to fetch result', isLoading: false });
      throw new Error('Failed to fetch result');
    }
  },

  // Fetch leaderboard for a quiz
  fetchLeaderboard: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/results/leaderboard/${quizId}`);
      set({ leaderboard: data.leaderboard, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch leaderboard', isLoading: false });
    }
  },

  // Fetch student dashboard stats
  fetchStudentStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/results/student/stats');
      set({ studentStats: data.stats, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch stats', isLoading: false });
    }
  },

  // Fetch quiz results (teacher analytics)
  fetchQuizResults: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/results/quiz/${quizId}`);
      set({
        quizResults: {
          results: data.results,
          questionStats: data.questionStats,
          summary: data.summary,
        },
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to fetch quiz results', isLoading: false });
    }
  },

  clearCurrentResult: () => set({ currentResult: null }),
  clearError: () => set({ error: null }),
}));

export default useResultStore;
