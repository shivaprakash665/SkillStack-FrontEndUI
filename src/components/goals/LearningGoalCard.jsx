import React from 'react';
import { useNavigate } from 'react-router-dom';

const LearningGoalCard = ({ goal, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      'not_started': { class: 'bg-secondary', text: 'Not Started' },
      'in_progress': { class: 'bg-primary', text: 'In Progress' },
      'completed': { class: 'bg-success', text: 'Completed' },
      'postponed': { class: 'bg-warning', text: 'Postponed' }
    };
    
    const config = statusConfig[status] || statusConfig['not_started'];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getDifficultyBadge = (difficulty) => {
    const difficultyConfig = {
      'easy': { class: 'bg-success', text: 'Easy' },
      'medium': { class: 'bg-warning', text: 'Medium' },
      'hard': { class: 'bg-danger', text: 'Hard' },
      'expert': { class: 'bg-dark', text: 'Expert' }
    };
    
    const config = difficultyConfig[difficulty] || difficultyConfig['medium'];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title mb-0">{goal.title}</h6>
          <div className="d-flex gap-1">
            {getStatusBadge(goal.status)}
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete goal"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
        
        {goal.description && (
          <p className="card-text text-muted small mb-2">{goal.description}</p>
        )}
        
        <div className="mb-3">
          <div className="progress" style={{ height: '8px' }}>
            <div 
              className="progress-bar" 
              style={{ width: `${goal.progress_percentage}%` }}
            ></div>
          </div>
          <small className="text-muted">{goal.progress_percentage}% Complete</small>
        </div>

        <div className="row small text-muted mb-3">
          <div className="col-6">
            <i className="bi bi-clock me-1"></i>
            {goal.total_hours}h
          </div>
          <div className="col-6 text-end">
            {getDifficultyBadge(goal.difficulty_rating)}
          </div>
        </div>

        <div className="row small text-muted mb-3">
          <div className="col-12">
            <i className="bi bi-tag me-1"></i>
            {goal.resource_type} • {goal.platform || 'Custom'}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <small className="text-muted">
            Started: {new Date(goal.start_date).toLocaleDateString()}
          </small>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`/goals/${goal.id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningGoalCard;