import React, { useState } from 'react';

const CertificateUpload = ({ goalId }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('learning_goal_id', goalId);
    formData.append('name', `Certificate for Goal ${goalId}`);
    formData.append('issuing_authority', 'Learning Platform');

    try {
      const response = await fetch(`http://localhost:5000/api/learning/certificates/upload?user_id=${user.id}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Certificate uploaded successfully!');
        event.target.value = ''; // Reset file input
      } else {
        setError(data.error || 'Failed to upload certificate');
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="certificate-upload">
      {message && (
        <div className="alert alert-success" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          {message}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="certificateFile" className="form-label">
          Choose certificate file (PDF, JPG, PNG - max 5MB)
        </label>
        <input
          type="file"
          className="form-control"
          id="certificateFile"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <div className="form-text">
          Supported formats: PDF, JPG, PNG. Maximum file size: 5MB
        </div>
      </div>

      {uploading && (
        <div className="d-flex align-items-center text-primary">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          <span>Uploading certificate...</span>
        </div>
      )}
    </div>
  );
};

export default CertificateUpload;