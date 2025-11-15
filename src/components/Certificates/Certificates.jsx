import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Certificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/certificates?user_id=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setCertificates(data.certificates || []);
      } else {
        setError(data.error || 'Failed to load certificates');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') return 'bi-file-earmark-pdf-fill text-danger';
    if (fileType.includes('image')) return 'bi-file-image-fill text-success';
    return 'bi-file-earmark-fill text-primary';
  };

  const downloadCertificate = (certificate) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = `http://localhost:5000${certificate.file_url}`;
    link.download = certificate.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p className="text-muted">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="certificates-page fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">My Certificates</h1>
          <p className="text-muted">Your learning achievements and certificates</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/goals')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Goals
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="bi bi-award display-1 text-muted mb-3"></i>
            <h5 className="text-muted">No certificates yet</h5>
            <p className="text-muted mb-3">
              Complete your learning goals and upload certificates to see them here
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/goals')}
            >
              View Learning Goals
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          {certificates.map(certificate => (
            <div key={certificate.id} className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{certificate.name}</h5>
                    <i className={`bi ${getFileIcon(certificate.file_type)} fs-4`}></i>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="bi bi-journal-bookmark me-1"></i>
                      Goal ID: {certificate.learning_goal_id}
                    </small>
                  </div>

                  {certificate.issuing_authority && (
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="bi bi-building me-1"></i>
                        Issued by: {certificate.issuing_authority}
                      </small>
                    </div>
                  )}

                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      Issued on: {new Date(certificate.issue_date).toLocaleDateString()}
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => downloadCertificate(certificate)}
                    >
                      <i className="bi bi-download me-1"></i>
                      Download
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => window.open(`http://localhost:5000${certificate.file_url}`, '_blank')}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;