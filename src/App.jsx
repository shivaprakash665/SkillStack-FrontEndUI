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

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    return false;
  }
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
              authenticated ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/add-goal"
            element={
              authenticated ? <AddLearningGoal /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/goals"
            element={
              authenticated ? <LearningGoalList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/goals/:id"
            element={
              authenticated ? <LearningGoalDetail /> : <Navigate to="/login" />
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;