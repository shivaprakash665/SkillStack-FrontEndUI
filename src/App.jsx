import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";
import Certificates from './components/Certificates/Certificates';
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import LearningGoalList from "./components/goals/LearningGoalList";
import LearningGoalDetail from "./components/goals/LearningGoalDetail";
import AddLearningGoal from "./components/goals/AddLearningGoal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";


const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, [location]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setAuthenticated(true)} />} />
          <Route path="/register" element={<Register onRegister={() => setAuthenticated(true)} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="App">
        <Routes>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="App">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="content-wrapper">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/goals" element={<LearningGoalList />} />
            <Route path="/add-goal" element={<AddLearningGoal />} />
            <Route path="/goals/:id" element={<LearningGoalDetail />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;