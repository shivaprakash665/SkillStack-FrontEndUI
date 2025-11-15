import React, { useState } from 'react';

const CertificateUpload = ({ goalId }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('learning_goal_id', goalId);
    formData.append('name', `Certificate for Goal ${goalId}`);

    setUploading(true);
    setMessage('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('http://localhost:5000/api/learning/certificates/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Certificate uploaded successfully!');
      } else {
        setMessage(data.error || 'Failed to upload certificate');
      }
    } catch (error) {
      setMessage('Network error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">
          <i className="bi bi-award me-2"></i>
          Upload Certificate
        </h5>
      </div>
      <div className="card-body">
        <p className="text-muted mb-3">
          Congratulations on completing this learning goal! Upload your certificate to keep a record of your achievement.
        </p>
        
        <div className="mb-3">
          <label htmlFor="certificateFile" className="form-label">Select Certificate File</label>
          <input
            type="file"
            className="form-control"
            id="certificateFile"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <div className="form-text">
            Supported formats: PDF, JPG, JPEG, PNG (Max 10MB)
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        {uploading && (
          <div className="alert alert-info">
            <i className="bi bi-arrow-up-circle me-2"></i>
            Uploading certificate...
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateUpload;