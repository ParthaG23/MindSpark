import { create } from 'zustand';
import api from '../api/axios';

const useQuizStore = create((set, get) => ({
  quizzes: [],
  myQuizzes: [],
  currentQuiz: null,
  pagination: null,
  isLoading: false,
  error: null,

  // Fetch all published quizzes (student browse)
  fetchQuizzes: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/quizzes', { params });
      set({ quizzes: data.quizzes, pagination: data.pagination, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch quizzes', isLoading: false });
    }
  },

  // Fetch teacher's own quizzes
  fetchMyQuizzes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/quizzes/my-quizzes');
      set({ myQuizzes: data.quizzes, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch your quizzes', isLoading: false });
    }
  },

  // Fetch single quiz
  fetchQuizById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/quizzes/${id}`);
      set({ currentQuiz: data.quiz, isLoading: false });
      return data.quiz;
    } catch (err) {
      set({ error: 'Failed to fetch quiz', isLoading: false });
      throw err;
    }
  },

  // Create quiz
  createQuiz: async (quizData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/quizzes', quizData);
      set((state) => ({
        myQuizzes: [data.quiz, ...state.myQuizzes],
        isLoading: false,
      }));
      return data.quiz;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create quiz';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Update quiz
  updateQuiz: async (id, quizData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/quizzes/${id}`, quizData);
      set((state) => ({
        myQuizzes: state.myQuizzes.map((q) => (q._id === id ? data.quiz : q)),
        currentQuiz: data.quiz,
        isLoading: false,
      }));
      return data.quiz;
    } catch (err) {
      set({ error: 'Failed to update quiz', isLoading: false });
      throw err;
    }
  },

  // Delete quiz
  deleteQuiz: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/quizzes/${id}`);
      set((state) => ({
        myQuizzes: state.myQuizzes.filter((q) => q._id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to delete quiz', isLoading: false });
      throw err;
    }
  },

  // Toggle publish
  togglePublish: async (id) => {
    try {
      const { data } = await api.patch(`/quizzes/${id}/publish`);
      set((state) => ({
        myQuizzes: state.myQuizzes.map((q) => (q._id === id ? data.quiz : q)),
      }));
      return data.quiz;
    } catch (err) {
      throw err;
    }
  },

  // Submit quiz (student)
  submitQuiz: async (submissionData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/results', submissionData);
      set({ isLoading: false });
      return data.result;
    } catch (err) {
      set({ error: 'Failed to submit quiz', isLoading: false });
      throw err;
    }
  },

  clearCurrentQuiz: () => set({ currentQuiz: null }),
  clearError: () => set({ error: null }),
}));

export default useQuizStore;
