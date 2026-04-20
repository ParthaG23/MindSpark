import express from 'express';
import {
  submitQuiz,
  getMyResults,
  getResultById,
  getLeaderboard,
  getQuizResults,
  getStudentStats,
} from '../controllers/resultController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.post('/', protect, authorize('student'), submitQuiz);
router.get('/my-results', protect, authorize('student'), getMyResults);
router.get('/student/stats', protect, authorize('student'), getStudentStats);

// Teacher analytics
router.get('/quiz/:quizId', protect, authorize('teacher'), getQuizResults);

// Shared routes
router.get('/leaderboard/:quizId', protect, getLeaderboard);
router.get('/:id', protect, getResultById);

export default router;
