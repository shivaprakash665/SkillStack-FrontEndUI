import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const Certificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [learningGoals, setLearningGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchCertificates();
    fetchCompletedGoals();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/certificates?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedGoals = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/goals?user_id=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        const completedGoals = data.learning_goals.filter(goal => goal.status === 'completed');
        setLearningGoals(completedGoals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedGoal) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('learning_goal_id', selectedGoal);
    formData.append('name', `Certificate for Goal ${selectedGoal}`);
    formData.append('user_id', user.id);

    setUploading(true);

    try {
      const response = await fetch('http://localhost:5000/api/learning/certificates/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCertificates(prev => [data.certificate, ...prev]);
        setShowUploadModal(false);
        setSelectedGoal('');
        alert('Certificate uploaded successfully!');
      } else {
        alert(data.error || 'Failed to upload certificate');
      }
    } catch (error) {
      alert('Network error occurred');
    } finally {
      setUploading(false);
    }
  };

  const downloadCertificate = (certificate) => {
    // Since we have file_url, we can create a download link
    const link = document.createElement('a');
    link.href = `http://localhost:5000${certificate.file_url}`;
    link.download = certificate.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingSpinner text="Loading certificates..." />;
  }

  return (
    <div className="certificates fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">Certificates</h1>
          <p className="text-muted">Your learning achievements and certifications</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowUploadModal(true)}
          disabled={learningGoals.length === 0}
        >
          <i className="bi bi-upload me-2"></i>
          Upload Certificate
        </button>
      </div>

      {learningGoals.length === 0 && certificates.length === 0 && (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="bi bi-award display-1 text-muted mb-3"></i>
            <h5 className="text-muted">No certificates yet</h5>
            <p className="text-muted mb-3">
              Complete your learning goals to upload certificates and track your achievements
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/goals')}
            >
              View My Goals
            </button>
          </div>
        </div>
      )}

      {/* Certificates Grid */}
      {certificates.length > 0 && (
        <div className="row">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 border-success">
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                  <h6 className="card-title mb-0">
                    <i className="bi bi-award me-2"></i>
                    Certificate
                  </h6>
                  <span className="badge bg-light text-success">
                    {certificate.file_type.toUpperCase()}
                  </span>
                </div>
                <div className="card-body">
                  <h6 className="card-title">{certificate.name}</h6>
                  
                  <div className="mb-3">
                    <small className="text-muted">Issued by:</small>
                    <div>{certificate.issuing_authority || 'Not specified'}</div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Issue Date:</small>
                    <div>{new Date(certificate.issue_date).toLocaleDateString()}</div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">File:</small>
                    <div className="text-truncate">{certificate.file_name}</div>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm flex-fill"
                      onClick={() => downloadCertificate(certificate)}
                    >
                      <i className="bi bi-download me-1"></i>
                      Download
                    </button>
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => navigate(`/goals/${certificate.learning_goal_id}`)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Goals without Certificates */}
      {learningGoals.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Completed Goals - Ready for Certificates
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {learningGoals.map((goal) => {
                    const hasCertificate = certificates.some(cert => cert.learning_goal_id === goal.id);
                    
                    return (
                      <div key={goal.id} className="col-md-6 mb-3">
                        <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                          <div>
                            <h6 className="mb-1">{goal.title}</h6>
                            <small className="text-muted">
                              Completed: {new Date(goal.actual_end_date || goal.updated_at).toLocaleDateString()}
                            </small>
                          </div>
                          <div>
                            {hasCertificate ? (
                              <span className="badge bg-success">
                                <i className="bi bi-check-lg me-1"></i>
                                Certified
                              </span>
                            ) : (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  setSelectedGoal(goal.id);
                                  setShowUploadModal(true);
                                }}
                              >
                                <i className="bi bi-upload me-1"></i>
                                Upload
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Certificate</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedGoal('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {!selectedGoal ? (
                  <div>
                    <label className="form-label">Select Completed Goal</label>
                    <select
                      className="form-select"
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                    >
                      <option value="">Choose a goal...</option>
                      {learningGoals.map(goal => (
                        <option key={goal.id} value={goal.id}>
                          {goal.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="form-label">Select Certificate File</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <div className="form-text">
                      Supported formats: PDF, JPG, JPEG, PNG (Max 10MB)
                    </div>
                    
                    {uploading && (
                      <div className="alert alert-info mt-3 mb-0">
                        <i className="bi bi-arrow-up-circle me-2"></i>
                        Uploading certificate...
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedGoal('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;