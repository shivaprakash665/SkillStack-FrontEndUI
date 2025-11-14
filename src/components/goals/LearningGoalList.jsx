import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningGoalCard from './LearningGoalCard';
import LoadingSpinner from '../common/LoadingSpinner';
import apiService from '../../services/api';

const LearningGoalList = ({ showViewAll = false, title = "My Learning Goals" }) => {
  const navigate = useNavigate();
  const [learningGoals, setLearningGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLearningGoals();
  }, []);

  const fetchLearningGoals = async () => {
    try {
      const data = await apiService.getLearningGoals();
      setLearningGoals(data.learning_goals || []);
    } catch (error) {
      setError(error.message || 'Failed to load learning goals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading learning goals..." />;
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{title}</h5>
        {showViewAll && learningGoals.length > 5 && (
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate('/goals')}
          >
            View All
          </button>
        )}
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {learningGoals.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-journal-x display-4 text-muted mb-3"></i>
            <p className="text-muted">No learning goals yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/add-goal')}
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="row">
            {(showViewAll ? learningGoals.slice(0, 5) : learningGoals).map(goal => (
              <div key={goal.id} className="col-lg-6 mb-3">
                <LearningGoalCard goal={goal} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningGoalList;