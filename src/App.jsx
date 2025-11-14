import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/common/Home";
import AddLearningGoal from "./components/goals/AddLearningGoal";
import LearningGoalList from "./components/goals/LearningGoalList";
import LearningGoalDetail from "./components/goals/LearningGoalDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Simple authentication check - just check if user is in localStorage
const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

function App() {
  const authenticated = isAuthenticated();

  return (
    <div className="App">
      <Header />
      <div className="container-fluid p-0">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              authenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/add-goal"
            element={
              authenticated ? <AddLearningGoal /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/goals"
            element={
              authenticated ? <LearningGoalList /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/goals/:id"
            element={
              authenticated ? <LearningGoalDetail /> : <Navigate to="/login" replace />
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;