import React from 'react';

const LoadingSpinner = ({ size = 'sm', text = 'Loading...' }) => {
  return (
    <div className="d-flex align-items-center justify-content-center p-3">
      <div className={`spinner-border spinner-border-${size} text-primary me-2`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="text-muted">{text}</span>
    </div>
  );
};

export default LoadingSpinner;