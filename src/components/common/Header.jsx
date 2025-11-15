import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/goals': 'Learning Goals',
      '/add-goal': 'Add Learning Goal',
      '/certificates': 'My Certificates'
    };
    
    if (location.pathname.startsWith('/goals/')) {
      return 'Goal Details';
    }
    
    return titles[location.pathname] || 'LearnTrack';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
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
          <div className="dropdown">
            <button 
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '45px', height: '45px' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <i className="bi bi-person-fill text-primary"></i>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu show" style={{ right: 0, left: 'auto' }}>
                <div className="dropdown-header">
                  <div className="fw-medium">{user.name}</div>
                  <small className="text-muted">{user.email}</small>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;