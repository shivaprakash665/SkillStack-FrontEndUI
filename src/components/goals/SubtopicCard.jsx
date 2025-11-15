import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NotesModal from './NotesModal';

const SubtopicCard = ({ session, onStatusChange, onNotesUpdate, onDelete, isDragging = false }) => {
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: session.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    return new Date(timeString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeInfo = () => {
    switch (session.status) {
      case 'completed':
        return { text: `Completed: ${formatTime(session.time_completed)}`, icon: 'bi-check-circle-fill text-success' };
      case 'in_progress':
        return { text: `Started: ${formatTime(session.time_started)}`, icon: 'bi-play-circle-fill text-primary' };
      default:
        return { text: `Added: ${formatTime(session.time_added)}`, icon: 'bi-plus-circle text-muted' };
    }
  };

  const handleNotesSave = async (notes, aiSummary) => {
    if (onNotesUpdate) {
      await onNotesUpdate(session.id, notes, aiSummary);
    }
  };

  const timeInfo = getTimeInfo();

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`subtopic-card ${session.status === 'completed' ? 'success' : session.status === 'in_progress' ? 'primary' : ''} ${
          isDragging ? 'shadow-lg' : ''
        }`}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="mb-0 text-truncate" style={{ maxWidth: '70%' }}>
            {session.title}
          </h6>
          <select
            className="form-select form-select-sm"
            value={session.status}
            onChange={(e) => onStatusChange(session.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'auto', minWidth: '120px' }}
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Description */}
        {session.description && (
          <p className="small text-muted mb-2 text-truncate">
            {session.description}
          </p>
        )}

        {/* Notes Preview */}
        {session.notes && (
          <div className="notes-preview mb-2 p-2 bg-light rounded">
            <small className="text-muted">
              <strong>Notes:</strong> {session.notes.length > 80 ? session.notes.substring(0, 80) + '...' : session.notes}
            </small>
          </div>
        )}

        {/* AI Summary Preview */}
        {session.ai_summary && (
          <div className="ai-summary-preview mb-2 p-2 bg-info bg-opacity-10 rounded">
            <small className="text-info">
              <i className="bi bi-robot me-1"></i>
              <strong>AI Summary:</strong> {session.ai_summary.length > 60 ? session.ai_summary.substring(0, 60) + '...' : session.ai_summary}
            </small>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex gap-1">
            <button
              className={`btn btn-sm ${session.notes ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowNotesModal(true);
              }}
              title={session.notes ? "View/Edit Notes" : "Add Notes"}
            >
              <i className={`bi ${session.notes ? 'bi-journal-text' : 'bi-journal-plus'}`}></i>
              {session.notes ? ' View Notes' : ' Add Notes'}
            </button>
          </div>
          
          <div className="d-flex gap-1">
            {session.ai_summary && (
              <span className="badge bg-info" title="AI Summary Available">
                <i className="bi bi-robot"></i>
              </span>
            )}
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
              title="Delete subtopic"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>

        {/* Time Info */}
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <i className={`${timeInfo.icon} me-1`}></i>
            {timeInfo.text}
          </small>
          
          {session.total_time_spent > 0 && (
            <small className="text-dark fw-bold">
              {session.total_time_spent}h
            </small>
          )}
        </div>

        {/* Progress for in-progress items */}
        {session.status === 'in_progress' && session.estimated_hours > 0 && (
          <div className="mt-2">
            <div className="progress" style={{ height: '4px' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${Math.min((session.actual_hours / session.estimated_hours) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <small className="text-muted">
              {session.actual_hours || 0}h / {session.estimated_hours}h
            </small>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <NotesModal
          show={showNotesModal}
          onClose={() => setShowNotesModal(false)}
          session={session}
          onSave={handleNotesSave}
        />
      )}
    </>
  );
};

export default SubtopicCard;