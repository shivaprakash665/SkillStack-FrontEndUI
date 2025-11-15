import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const StudySessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [learningGoals, setLearningGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStudySessions();
    fetchLearningGoals();
  }, []);

  const fetchStudySessions = async () => {
    try {
      // Fetch all goals and extract their sessions
      const response = await fetch(`http://localhost:5000/api/learning/goals?user_id=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        const allSessions = data.learning_goals.flatMap(goal => 
          (goal.sessions || []).map(session => ({
            ...session,
            goal_title: goal.title,
            goal_category: goal.category
          }))
        );
        setSessions(allSessions);
      } else {
        throw new Error(data.error || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLearningGoals = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/goals?user_id=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setLearningGoals(data.learning_goals || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.goal_title && session.goal_title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || session.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'not_started': { class: 'bg-secondary', text: 'Not Started', icon: 'bi-circle' },
      'in_progress': { class: 'bg-primary', text: 'In Progress', icon: 'bi-play-circle' },
      'completed': { class: 'bg-success', text: 'Completed', icon: 'bi-check-circle' }
    };
    
    const config = statusConfig[status] || statusConfig['not_started'];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const formatDuration = (hours) => {
    if (!hours || hours === 0) return 'Not tracked';
    return `${hours}h`;
  };

  if (loading) {
    return <LoadingSpinner text="Loading study sessions..." />;
  }

  return (
    <div className="study-sessions fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">Study Sessions</h1>
          <p className="text-muted">Track and manage all your learning sessions</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/add-goal')}
        >
          <i className="bi bi-plus-circle me-2"></i>
          New Goal
        </button>
      </div>

      {/* Filters and Search */}
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
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">
                {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="row">
        <div className="col-12">
          {filteredSessions.length === 0 ? (
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="bi bi-clock display-1 text-muted mb-3"></i>
                <h5 className="text-muted">No study sessions found</h5>
                <p className="text-muted mb-3">
                  {searchTerm || filter !== 'all' ? 'Try adjusting your search or filters' : 'Start by creating learning goals and adding sessions'}
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
              {filteredSessions.map((session) => (
                <div key={session.id} className="col-lg-6 mb-3">
                  <div 
                    className="card h-100 hover-shadow"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/goals/${session.learning_goal_id}`)}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0 text-truncate" style={{ maxWidth: '70%' }}>
                          {session.title}
                        </h6>
                        {getStatusBadge(session.status)}
                      </div>
                      
                      <p className="card-text text-muted small mb-3">
                        {session.description || 'No description provided'}
                      </p>

                      <div className="row text-muted small mb-3">
                        <div className="col-6">
                          <i className="bi bi-journal-bookmark me-1"></i>
                          {session.goal_title || 'Unknown Goal'}
                        </div>
                        <div className="col-6 text-end">
                          <i className="bi bi-clock me-1"></i>
                          {formatDuration(session.estimated_hours)}
                        </div>
                      </div>

                      {/* Time Tracking */}
                      <div className="border-top pt-3">
                        <div className="row small text-muted">
                          <div className="col-6">
                            <div>Added:</div>
                            <small className="text-dark">
                              {session.time_added ? new Date(session.time_added).toLocaleDateString() : 'N/A'}
                            </small>
                          </div>
                          <div className="col-6 text-end">
                            <div>Time Spent:</div>
                            <small className="text-dark fw-bold">
                              {session.total_time_spent > 0 ? `${session.total_time_spent}h` : 'Not started'}
                            </small>
                          </div>
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

      {/* Quick Stats */}
      {sessions.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body">
                <h6 className="card-title mb-3">Session Overview</h6>
                <div className="row text-center">
                  <div className="col-3">
                    <div className="h4 text-primary mb-1">{sessions.length}</div>
                    <small className="text-muted">Total Sessions</small>
                  </div>
                  <div className="col-3">
                    <div className="h4 text-success mb-1">
                      {sessions.filter(s => s.status === 'completed').length}
                    </div>
                    <small className="text-muted">Completed</small>
                  </div>
                  <div className="col-3">
                    <div className="h4 text-warning mb-1">
                      {sessions.filter(s => s.status === 'in_progress').length}
                    </div>
                    <small className="text-muted">In Progress</small>
                  </div>
                  <div className="col-3">
                    <div className="h4 text-muted mb-1">
                      {sessions.filter(s => s.status === 'not_started').length}
                    </div>
                    <small className="text-muted">Not Started</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessions;