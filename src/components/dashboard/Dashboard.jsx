import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalGoals: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0
  });
  const [recentGoals, setRecentGoals] = useState([]);
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

      // Fetch goals from your backend
      const response = await fetch(`http://localhost:5000/api/learning/goals?user_id=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        const goals = data.learning_goals || [];
        
        // Calculate stats
        const totalGoals = goals.length;
        const inProgress = goals.filter(g => g.status === 'in_progress').length;
        const completed = goals.filter(g => g.status === 'completed').length;
        const completionRate = totalGoals > 0 ? Math.round((completed / totalGoals) * 100) : 0;

        setStats({
          totalGoals,
          inProgress,
          completed,
          completionRate
        });

        // Get recent goals (last 4)
        const sortedGoals = goals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentGoals(sortedGoals.slice(0, 4));
      } else {
        throw new Error(data.error || 'Failed to fetch goals');
      }
    } catch (error) {
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className="card h-100 fade-in">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title text-muted mb-2">{title}</h6>
            <h2 className={`fw-bold text-${color} mb-1`}>{value}</h2>
            <p className="text-muted small mb-0">{subtitle}</p>
          </div>
          <div className={`bg-${color} bg-opacity-10 rounded-circle p-3`}>
            <i className={`bi bi-${icon} text-${color} fs-4`}></i>
          </div>
        </div>
      </div>
    </div>
  );

  const ProgressCircle = ({ percentage, size = 60 }) => {
    const radius = size / 2 - 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="progress-circle position-relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="progress-ring">
          <circle
            stroke="#e9ecef"
            strokeWidth="4"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke="#4361ee"
            strokeWidth="4"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>
            {percentage}%
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'not_started': { class: 'bg-secondary', text: 'Not Started' },
      'in_progress': { class: 'bg-primary', text: 'In Progress' },
      'completed': { class: 'bg-success', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig['not_started'];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="h2 fw-bold mb-2">Welcome back, {user.name}!</h1>
                  <p className="mb-0 opacity-75">Track your learning progress and achieve your goals</p>
                </div>
                <div className="col-md-4 text-end">
                  <button 
                    className="btn btn-light btn-lg"
                    onClick={() => navigate('/add-goal')}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <StatCard
            title="Total Goals"
            value={stats.totalGoals}
            subtitle="Learning objectives"
            icon="journal-bookmark"
            color="primary"
          />
        </div>
        <div className="col-md-3 mb-3">
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            subtitle="Active learning"
            icon="clock"
            color="warning"
          />
        </div>
        <div className="col-md-3 mb-3">
          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Goals achieved"
            icon="check-circle"
            color="success"
          />
        </div>
        <div className="col-md-3 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-2">Completion Rate</h6>
                  <div className="d-flex align-items-center">
                    <ProgressCircle percentage={stats.completionRate} />
                    <div className="ms-3">
                      <h4 className="fw-bold text-dark mb-0">{stats.completionRate}%</h4>
                      <small className="text-muted">Overall progress</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Goals & Quick Actions */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card h-100">
            <div className="card-header bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Learning Goals</h5>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate('/goals')}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="card-body">
              {recentGoals.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-journal-x display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No goals yet</h5>
                  <p className="text-muted mb-3">Start your learning journey by creating your first goal</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/add-goal')}
                  >
                    Create First Goal
                  </button>
                </div>
              ) : (
                <div className="row">
                  {recentGoals.map(goal => (
                    <div key={goal.id} className="col-md-6 mb-3">
                      <div 
                        className="card h-100 border-0 bg-light hover-shadow"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/goals/${goal.id}`)}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0 text-truncate">{goal.title}</h6>
                            {getStatusBadge(goal.status)}
                          </div>
                          
                          {goal.description && (
                            <p className="card-text text-muted small mb-3">
                              {goal.description.length > 80 ? goal.description.substring(0, 80) + '...' : goal.description}
                            </p>
                          )}

                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {goal.category || 'Uncategorized'}
                            </small>
                            <div className="progress" style={{ width: '80px', height: '6px' }}>
                              <div 
                                className="progress-bar" 
                                style={{ width: `${goal.progress_percentage || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary btn-lg d-flex align-items-center justify-content-start p-3"
                  onClick={() => navigate('/add-goal')}
                >
                  <i className="bi bi-plus-circle fs-4 me-3"></i>
                  <div className="text-start">
                    <div className="fw-bold">Add New Goal</div>
                    <small>Create a learning objective</small>
                  </div>
                </button>
                
                <button 
                  className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-start p-3"
                  onClick={() => navigate('/goals')}
                >
                  <i className="bi bi-journal-bookmark fs-4 me-3"></i>
                  <div className="text-start">
                    <div className="fw-bold">View All Goals</div>
                    <small>See your progress</small>
                  </div>
                </button>

                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Progress Tip</h6>
                  <p className="small text-muted mb-0">
                    Consistency is key! Try to study for at least 30 minutes every day to maintain steady progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;