import React, { useState } from 'react';
import Modal from '../common/Modal';

const NotesModal = ({ show, onClose, session, onSave }) => {
  const [notes, setNotes] = useState(session?.notes || '');
  const [aiSummary, setAiSummary] = useState(session?.ai_summary || '');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleSave = () => {
    onSave(notes, aiSummary);
    onClose();
  };

  const generateAISummary = async () => {
    if (!notes.trim()) {
      alert('Please add some notes first before generating a summary.');
      return;
    }

    setGeneratingSummary(true);
    setAiError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/learning/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notes: notes,
          session_id: session?.id 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAiSummary(data.summary);
      } else {
        setAiError(data.error || 'Failed to generate AI summary');
      }
    } catch (error) {
      console.error('Error generating AI summary:', error);
      setAiError('Network error. Please check your connection and try again.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleRegenerate = () => {
    setAiError('');
    generateAISummary();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Modal show={show} onClose={onClose} title="Session Notes" size="lg">
      <div className="notes-modal">
        <div className="mb-3">
          <label htmlFor="notes" className="form-label fw-bold">
            <i className="bi bi-journal-text me-2"></i>
            Your Notes
          </label>
          <textarea
            className="form-control"
            id="notes"
            rows="8"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your study notes, key points, code snippets, or important concepts here..."
          ></textarea>
          <div className="form-text">
            Write down important information, code examples, or key concepts you learned.
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label fw-bold">
              <i className="bi bi-robot me-2"></i>
              AI Summary
            </label>
            <div className="d-flex gap-2">
              {aiSummary && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={() => copyToClipboard(aiSummary)}
                    title="Copy to clipboard"
                  >
                    <i className="bi bi-clipboard me-1"></i>
                    Copy
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning btn-sm"
                    onClick={handleRegenerate}
                    disabled={generatingSummary}
                  >
                    <i className="bi bi-arrow-repeat me-1"></i>
                    Regenerate
                  </button>
                </>
              )}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={generateAISummary}
                disabled={generatingSummary || !notes.trim()}
              >
                {generatingSummary ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    AI Thinking...
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic me-1"></i>
                    {aiSummary ? 'Update' : 'Generate'} Summary
                  </>
                )}
              </button>
            </div>
          </div>
          
          {aiError && (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {aiError}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setAiError('')}
              ></button>
            </div>
          )}
          
          <textarea
            className="form-control"
            rows="4"
            value={aiSummary}
            onChange={(e) => setAiSummary(e.target.value)}
            placeholder={generatingSummary ? "AI is analyzing your notes..." : "AI-generated summary will appear here. Click 'Generate Summary' to create one."}
            style={{ 
              backgroundColor: aiSummary ? '#f8f9fa' : 'white',
              border: aiSummary ? '2px solid #e9ecef' : '1px solid #ced4da',
              fontStyle: aiSummary ? 'normal' : 'italic'
            }}
            disabled={generatingSummary}
          />
          <div className="form-text">
            {generatingSummary 
              ? "AI is processing your notes. This usually takes 5-10 seconds..." 
              : "Get an AI-powered summary of your notes to help with revision. The AI will extract key concepts and main points."
            }
          </div>
        </div>

        {/* Notes Statistics */}
        <div className="row text-center mb-3">
          <div className="col-4">
            <div className="card bg-light">
              <div className="card-body py-2">
                <h6 className="mb-0">{notes.length}</h6>
                <small className="text-muted">Characters</small>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card bg-light">
              <div className="card-body py-2">
                <h6 className="mb-0">{notes.split(/\s+/).filter(word => word.length > 0).length}</h6>
                <small className="text-muted">Words</small>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card bg-light">
              <div className="card-body py-2">
                <h6 className="mb-0">{notes.split('.').filter(sentence => sentence.trim().length > 0).length}</h6>
                <small className="text-muted">Sentences</small>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Notes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NotesModal;