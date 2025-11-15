import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningGoalCard from './LearningGoalCard';
import LoadingSpinner from '../common/LoadingSpinner';

const LearningGoalList = () => {
  const navigate = useNavigate();
  const [learningGoals, setLearningGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchLearningGoals();
  }, []);

  useEffect(() => {
    filterGoals();
  }, [learningGoals, searchTerm, statusFilter]);

  const fetchLearningGoals = async () => {
    try {
      if (!user.id) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/learning/goals?user_id=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setLearningGoals(data.learning_goals || []);
      } else {
        setError(data.error || 'Failed to load learning goals');
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterGoals = () => {
    let filtered = learningGoals;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(goal => goal.status === statusFilter);
    }

    setFilteredGoals(filtered);
  };

  if (loading) {
    return <LoadingSpinner text="Loading learning goals..." />;
  }

  return (
    <div className="learning-goals-container fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">My Learning Goals</h1>
          <p className="text-muted">Track and manage your learning objectives</p>
        </div>
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/add-goal')}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Goal
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">
                {filteredGoals.length} goal{filteredGoals.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="bi bi-journal-x display-1 text-muted mb-3"></i>
            <h5 className="text-muted">No learning goals found</h5>
            <p className="text-muted mb-3">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Start by creating your first learning goal'}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/add-goal')}
            >
              Create Your First Goal
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredGoals.map(goal => (
            <div key={goal.id} className="col-lg-6 mb-4">
              <LearningGoalCard goal={goal} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningGoalList;