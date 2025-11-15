// App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/common/Home';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Certificates from './components/Certificates/Certificates';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LearningGoalList from './components/goals/LearningGoalList';
import LearningGoalDetail from './components/goals/LearningGoalDetail';
import AddLearningGoal from './components/goals/AddLearningGoal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Auth check
const isAuthenticated = () => !!localStorage.getItem('user');

// --- Protected Route wrapper ---
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// --- Public Route wrapper (redirects logged-in users) ---
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Force re-render when location changes (for auth check)
  useEffect(() => {}, [location]);

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Sidebar isOpen={sidebarOpen} />
              <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div className="content-wrapper">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="goals" element={<LearningGoalList />} />
                    <Route path="add-goal" element={<AddLearningGoal />} />
                    <Route path="goals/:id" element={<LearningGoalDetail />} />
                    <Route path="certificates" element={<Certificates />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
