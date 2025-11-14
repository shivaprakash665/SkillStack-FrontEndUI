import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h1 className="h2 fw-bold text-primary mb-1">
                      Welcome to SkillStack, {user.name}!
                    </h1>
                    <p className="text-muted mb-0">
                      Track your learning progress and build new skills
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </div>

                <div className="row mt-4">
                  <div className="col-md-3 mb-4">
                    <div className="card text-white bg-primary h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="card-title">Learning Goals</h5>
                            <h2 className="mb-0">0</h2>
                          </div>
                          <i className="bi bi-bullseye display-6 opacity-50"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-4">
                    <div className="card text-white bg-success h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="card-title">In Progress</h5>
                            <h2 className="mb-0">0</h2>
                          </div>
                          <i className="bi bi-clock display-6 opacity-50"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-4">
                    <div className="card text-white bg-warning h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="card-title">Completed</h5>
                            <h2 className="mb-0">0</h2>
                          </div>
                          <i className="bi bi-check-circle display-6 opacity-50"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-4">
                    <div className="card text-white bg-info h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="card-title">Skills</h5>
                            <h2 className="mb-0">0</h2>
                          </div>
                          <i className="bi bi-award display-6 opacity-50"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Getting Started</h5>
                        <p className="text-muted">
                          Start adding your learning goals, courses, and track your progress. 
                          This is your personalized skill-building dashboard.
                        </p>
                        <div className="d-flex gap-3">
                          <button className="btn btn-primary">
                            <i className="bi bi-plus-circle me-2"></i>
                            Add Learning Goal
                          </button>
                          <button className="btn btn-outline-primary">
                            <i className="bi bi-book me-2"></i>
                            Browse Courses
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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