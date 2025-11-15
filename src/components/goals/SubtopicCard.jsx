import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NotesModal from './NotesModal';

const SubtopicCard = ({ session, onStatusChange, onNotesUpdate, isDragging = false }) => {
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

        {/* Notes Indicator */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotesModal(true);
            }}
          >
            <i className={`bi ${session.notes ? 'bi-journal-text' : 'bi-journal-plus'} me-1`}></i>
            {session.notes ? 'View Notes' : 'Add Notes'}
          </button>
          
          {session.ai_summary && (
            <span className="badge bg-info" title="AI Summary Available">
              <i className="bi bi-robot me-1"></i>
              AI
            </span>
          )}
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