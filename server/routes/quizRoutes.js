import express from 'express';
import {
  createQuiz,
  getQuizzes,
  getMyQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  togglePublish,
  getTeacherStats,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Teacher-only routes
router.get('/dashboard/stats', protect, authorize('teacher'), getTeacherStats);
router.get('/my-quizzes', protect, authorize('teacher'), getMyQuizzes);
router.post('/', protect, authorize('teacher'), createQuiz);
router.put('/:id', protect, authorize('teacher'), updateQuiz);
router.delete('/:id', protect, authorize('teacher'), deleteQuiz);
router.patch('/:id/publish', protect, authorize('teacher'), togglePublish);

// Authenticated routes (both roles)
router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);

export default router;
