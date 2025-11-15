import React from 'react';

const StatsCards = ({ learningGoals, analytics, dueSoonGoals }) => {
  const stats = {
    totalGoals: learningGoals.length,
    inProgress: learningGoals.filter(g => g.status === 'in_progress').length,
    completed: learningGoals.filter(g => g.status === 'completed').length,
    completionRate: learningGoals.length > 0 ? 
      Math.round((learningGoals.filter(g => g.status === 'completed').length / learningGoals.length) * 100) : 0,
    weeklyAverage: analytics?.weekly_average || 0,
    dueSoon: dueSoonGoals.length
  };

  const ProgressCircle = ({ percentage, size = 50, label }) => {
    const radius = size / 2 - 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="progress-circle-mini position-relative">
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
            stroke="var(--primary-green)"
            strokeWidth="4"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <div className="fw-bold text-dark" style={{ fontSize: '12px', lineHeight: '1' }}>
            {percentage}%
          </div>
        </div>
        <div className="text-center mt-1">
          <small className="text-muted">{label}</small>
        </div>
      </div>
    );
  };

  return (
    <div className="stats-grid">
      {/* Completion Rate */}
      <div className="stat-card">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-label">Overall Completion</div>
          </div>
          <ProgressCircle 
            percentage={stats.completionRate} 
            label="Completed"
          />
        </div>
      </div>

      {/* In Progress */}
      <div className="stat-card">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <ProgressCircle 
            percentage={learningGoals.length > 0 ? Math.round((stats.inProgress / learningGoals.length) * 100) : 0}
            label="Active"
          />
        </div>
      </div>

      {/* Weekly Average */}
      <div className="stat-card">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="stat-value">{stats.weeklyAverage}h</div>
            <div className="stat-label">Weekly Average</div>
          </div>
          <div className="text-center">
            <i className="bi bi-clock-fill text-primary fs-2"></i>
            <div className="text-muted small mt-1">Study Time</div>
          </div>
        </div>
      </div>

      {/* Due Soon */}
      <div className={`stat-card ${stats.dueSoon > 0 ? 'warning' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="stat-value">{stats.dueSoon}</div>
            <div className="stat-label">Due Soon</div>
          </div>
          <div className="text-center">
            <i className={`bi bi-calendar-x${stats.dueSoon > 0 ? '-fill text-warning' : ' text-muted'} fs-2`}></i>
            <div className="text-muted small mt-1">This Week</div>
          </div>
        </div>
        {stats.dueSoon > 0 && (
          <div className="mt-2">
            <small className="text-warning">
              <i className="bi bi-exclamation-triangle me-1"></i>
              {stats.dueSoon} goal{stats.dueSoon > 1 ? 's' : ''} approaching deadline
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCards;