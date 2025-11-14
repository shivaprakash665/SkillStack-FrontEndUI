import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import apiService from '../../services/api';

const AddLearningGoal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_type: 'course',
    platform: '',
    link: '',
    start_date: new Date().toISOString().split('T')[0],
    expected_end_date: '',
    difficulty_rating: 'medium',
    total_hours: 0,
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resourceTypes = [
    { value: 'course', label: 'Course' },
    { value: 'video', label: 'Video Series' },
    { value: 'article', label: 'Article' },
    { value: 'book', label: 'Book' },
    { value: 'tutorial', label: 'Tutorial' }
  ];

  const platforms = [
    { value: 'Udemy', label: 'Udemy' },
    { value: 'Coursera', label: 'Coursera' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'LinkedIn', label: 'LinkedIn Learning' },
    { value: 'Pluralsight', label: 'Pluralsight' },
    { value: 'Skillshare', label: 'Skillshare' },
    { value: 'Custom', label: 'Custom' }
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.createLearningGoal(formData);
      navigate('/goals');
    } catch (error) {
      setError(error.message || 'Failed to create learning goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-0">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Learning Goal
                </h4>
              </div>
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="title" className="form-label">Goal Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Learn React Fundamentals"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="category" className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g., Programming, Design, Business"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of your learning goal..."
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="resource_type" className="form-label">Resource Type *</label>
                      <select
                        className="form-select"
                        id="resource_type"
                        name="resource_type"
                        value={formData.resource_type}
                        onChange={handleChange}
                        required
                      >
                        {resourceTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="platform" className="form-label">Platform</label>
                      <select
                        className="form-select"
                        id="platform"
                        name="platform"
                        value={formData.platform}
                        onChange={handleChange}
                      >
                        <option value="">Select Platform</option>
                        {platforms.map(platform => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="link" className="form-label">Resource Link</label>
                    <input
                      type="url"
                      className="form-control"
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="start_date" className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="expected_end_date" className="form-label">Expected End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="expected_end_date"
                        name="expected_end_date"
                        value={formData.expected_end_date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="difficulty_rating" className="form-label">Difficulty Level</label>
                      <select
                        className="form-select"
                        id="difficulty_rating"
                        name="difficulty_rating"
                        value={formData.difficulty_rating}
                        onChange={handleChange}
                      >
                        {difficultyLevels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="total_hours" className="form-label">Estimated Total Hours</label>
                      <input
                        type="number"
                        className="form-control"
                        id="total_hours"
                        name="total_hours"
                        value={formData.total_hours}
                        onChange={handleChange}
                        min="0"
                        step="0.5"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/goals')}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" text="Creating..." /> : 'Create Learning Goal'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLearningGoal;