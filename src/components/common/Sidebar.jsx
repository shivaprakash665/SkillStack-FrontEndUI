import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/goals', icon: 'bi-journal-bookmark', label: 'Learning Goals' },
    { path: '/certificates', icon: 'bi-award', label: 'Certificates' },
  ];

  return (
    <div 
      className="sidebar bg-dark text-white position-fixed top-0 left-0 h-100"
      style={{ 
        width: isOpen ? '280px' : '80px',
        transition: 'width 0.3s ease',
        zIndex: 1000
      }}
    >
      {/* Logo */}
      <div className="sidebar-header p-4 border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <i className="bi bi-journal-bookmark fs-3 text-primary"></i>
          {isOpen && (
            <span className="ms-3 fs-4 fw-bold text-white">LearnTrack</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav p-3">
        <ul className="nav nav-pills flex-column">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item mb-2">
              <Link
                to={item.path}
                className={`nav-link text-white d-flex align-items-center ${
                  location.pathname === item.path ? 'bg-primary' : 'hover-bg-light'
                }`}
                style={{ 
                  borderRadius: '12px',
                  padding: '14px 16px',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className={`${item.icon} ${isOpen ? 'me-3' : ''}`} style={{ width: '20px' }}></i>
                {isOpen && <span className="fw-medium">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;