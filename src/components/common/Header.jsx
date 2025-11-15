import React from 'react';

const Header = ({ onMenuToggle }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/goals': 'Learning Goals',
      '/add-goal': 'Add Learning Goal'
    };
    
    if (location.pathname.startsWith('/goals/')) {
      return 'Goal Details';
    }
    
    return titles[location.pathname] || 'LearnTrack';
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm border-bottom">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-light me-3"
            onClick={onMenuToggle}
          >
            <i className="bi bi-list"></i>
          </button>
          <h4 className="mb-0 fw-bold text-dark">{getPageTitle()}</h4>
        </div>
        
        <div className="d-flex align-items-center">
          <div className="me-3 text-end d-none d-md-block">
            <div className="fw-medium text-dark">{user.name}</div>
            <small className="text-muted">Welcome back!</small>
          </div>
          <div className="dropdown">
            <button 
              className="btn btn-light rounded-circle"
              style={{ width: '45px', height: '45px' }}
            >
              <i className="bi bi-person-fill text-primary"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;