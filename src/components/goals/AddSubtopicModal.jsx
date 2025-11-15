import React, { useState } from 'react';
import Modal from '../common/Modal';

const AddSubtopicModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_hours: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <Modal show={true} onClose={onClose} title="Add New Subtopic" size="md">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Subtopic Title *</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Python Basics, Data Types, etc."
          />
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
            placeholder="Brief description of this subtopic..."
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="estimated_hours" className="form-label">Estimated Hours</label>
          <input
            type="number"
            className="form-control"
            id="estimated_hours"
            name="estimated_hours"
            value={formData.estimated_hours}
            onChange={handleChange}
            min="0"
            step="0.5"
            placeholder="0"
          />
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Subtopic
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSubtopicModal;