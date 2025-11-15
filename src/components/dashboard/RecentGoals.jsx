import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentGoals = ({ learningGoals, dueSoonGoals }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      'not_started': { class: 'bg-secondary', text: 'Not Started' },
      'in_progress': { class: 'bg-primary', text: 'In Progress' },
      'completed': { class: 'bg-success', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig['not_started'];
    return <span className={`badge ${config.class} badge-sm`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <div className="card h-100">
      <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="bi bi-journal-bookmark me-2 text-primary"></i>
          Recent Goals
        </h5>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate('/goals')}
        >
          View All
        </button>
      </div>
      <div className="card-body">
        {/* Due Soon Alert */}
        {dueSoonGoals.length > 0 && (
          <div className="due-soon-alert mb-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-clock fs-5 me-2"></i>
              <div>
                <strong>{dueSoonGoals.length} goal{dueSoonGoals.length > 1 ? 's' : ''} due soon</strong>
                <div className="small">Complete them before deadline</div>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="goals-list">
          {learningGoals.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-journal-x display-6 text-muted mb-3"></i>
              <p className="text-muted">No goals found</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/add-goal')}
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            learningGoals.map(goal => (
              <div 
                key={goal.id} 
                className="goal-item p-3 border-bottom hover-bg-light"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/goals/${goal.id}`)}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0 text-truncate" style={{ maxWidth: '70%' }}>
                    {goal.title}
                  </h6>
                  {getStatusBadge(goal.status)}
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {goal.category || 'Uncategorized'}
                  </small>
                  <div className="progress" style={{ width: '60px', height: '6px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ width: `${goal.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Due Date */}
                {goal.expected_end_date && (
                  <div className="mt-2">
                    <small className={`badge ${
                      new Date(goal.expected_end_date) < new Date() ? 'bg-danger' : 
                      (new Date(goal.expected_end_date) - new Date()) / (1000 * 60 * 60 * 24) <= 7 ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      <i className="bi bi-calendar me-1"></i>
                      {formatDate(goal.expected_end_date)}
                    </small>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {learningGoals.length > 0 && (
          <div className="mt-3 pt-3 border-top">
            <div className="row text-center">
              <div className="col-6">
                <button 
                  className="btn btn-outline-primary btn-sm w-100"
                  onClick={() => navigate('/add-goal')}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Goal
                </button>
              </div>
              <div className="col-6">
                <button 
                  className="btn btn-outline-success btn-sm w-100"
                  onClick={() => navigate('/goals')}
                >
                  <i className="bi bi-list-ul me-1"></i>
                  View All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentGoals;