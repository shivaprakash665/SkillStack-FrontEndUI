import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Track Your Learning Journey
              </h1>
              <p className="lead mb-4">
                SkillStack helps you organize, track, and master new skills through courses, 
                tutorials, and certifications. Build your personalized learning path today.
              </p>
              {!isAuthenticated ? (
                <div className="d-flex gap-3">
                  <Link to="/register" className="btn btn-light btn-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="d-flex gap-3">
                  <Link to="/dashboard" className="btn btn-light btn-lg">
                    Go to Dashboard
                  </Link>
                  <Link to="/add-goal" className="btn btn-outline-light btn-lg">
                    Add New Goal
                  </Link>
                </div>
              )}
            </div>
            <div className="col-lg-6 text-center">
              <i className="bi bi-journal-bookmark-fill display-1"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="fw-bold">Why Choose SkillStack?</h2>
              <p className="text-muted">Everything you need to track your learning progress</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-bullseye text-primary display-6 mb-3"></i>
                  <h5 className="card-title">Set Learning Goals</h5>
                  <p className="card-text text-muted">
                    Define clear learning objectives and track your progress towards mastery.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-graph-up text-success display-6 mb-3"></i>
                  <h5 className="card-title">Track Progress</h5>
                  <p className="card-text text-muted">
                    Monitor your learning journey with detailed progress tracking and insights.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-award text-warning display-6 mb-3"></i>
                  <h5 className="card-title">Earn Certifications</h5>
                  <p className="card-text text-muted">
                    Keep all your certifications and completed courses in one organized place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;