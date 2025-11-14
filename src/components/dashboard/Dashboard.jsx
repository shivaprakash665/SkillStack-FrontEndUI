import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCards from './StatsCards';
import ProgressChart from './ProgressChart';
import StudyTimeChart from './StudyTimeChart';
import LearningGoalList from '../goals/LearningGoalList';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [learningGoals, setLearningGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      
      if (!user.id) {
        navigate('/login');
        return;
      }

      // Fetch goals
      const goalsResponse = await fetch(`http://localhost:5000/api/learning/goals?user_id=${user.id}`);
      const goalsData = await goalsResponse.json();
      
      if (goalsResponse.ok) {
        setLearningGoals(goalsData.learning_goals || []);
      } else {
        throw new Error(goalsData.error || 'Failed to fetch goals');
      }

      // Fetch analytics
      const analyticsResponse = await fetch(`http://localhost:5000/api/learning/analytics?user_id=${user.id}`);
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

    } catch (error) {
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 fw-bold text-primary mb-1">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted mb-0">
              Track your learning progress and build new skills
            </p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/add-goal')}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Learning Goal
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards learningGoals={learningGoals} analytics={analytics} />

        {/* Charts Row */}
        <div className="row mb-4">
          <div className="col-md-6 mb-4">
            <ProgressChart learningGoals={learningGoals} />
          </div>
          <div className="col-md-6 mb-4">
            <StudyTimeChart analytics={analytics} />
          </div>
        </div>

        {/* Recent Goals */}
        <div className="row">
          <div className="col-12">
            <LearningGoalList 
              learningGoals={learningGoals.slice(0, 5)} 
              showViewAll={true}
              title="Recent Learning Goals"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;