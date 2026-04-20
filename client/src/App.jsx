import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import PageTransition from './components/layout/PageTransition';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateQuiz from './pages/teacher/CreateQuiz';
import QuizAnalytics from './pages/teacher/QuizAnalytics';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseQuizzes from './pages/student/BrowseQuizzes';
import TakeQuiz from './pages/student/TakeQuiz';
import QuizResult from './pages/student/QuizResult';

import useAuthStore from './store/authStore';

function App() {
  const { user } = useAuthStore();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Navbar />
      <PageTransition>
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                  replace
                />
              ) : (
                <Landing />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                  replace
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate
                  to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                  replace
                />
              ) : (
                <Register />
              )
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/create-quiz"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/edit-quiz/:id"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/analytics/:id"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <QuizAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/browse"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <BrowseQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/quiz/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/result/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <QuizResult />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </>
  );
}

export default App;
