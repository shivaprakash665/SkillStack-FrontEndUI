import React from 'react';

const StatsCards = ({ learningGoals, analytics }) => {
  const stats = {
    totalGoals: learningGoals.length,
    inProgress: learningGoals.filter(g => g.status === 'in_progress').length,
    completed: learningGoals.filter(g => g.status === 'completed').length,
    weeklyAverage: analytics?.weekly_average || 0
  };

  return (
    <div className="row mb-4">
      <div className="col-md-3 mb-3">
        <div className="card text-white bg-primary h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">Total Goals</h5>
                <h2 className="mb-0">{stats.totalGoals}</h2>
              </div>
              <i className="bi bi-bullseye display-6 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className="card text-white bg-success h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">In Progress</h5>
                <h2 className="mb-0">{stats.inProgress}</h2>
              </div>
              <i className="bi bi-clock display-6 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className="card text-white bg-warning h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">Completed</h5>
                <h2 className="mb-0">{stats.completed}</h2>
              </div>
              <i className="bi bi-check-circle display-6 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className="card text-white bg-info h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">Weekly Avg</h5>
                <h2 className="mb-0">{stats.weeklyAverage}h</h2>
              </div>
              <i className="bi bi-graph-up display-6 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;