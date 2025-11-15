import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SubtopicCard = ({ session, onStatusChange, isDragging = false }) => {
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
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusOptions = (currentStatus) => {
    const options = {
      not_started: ['in_progress'],
      in_progress: ['not_started', 'completed'],
      completed: ['in_progress']
    };
    return options[currentStatus] || [];
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleDateString();
  };

  const getTimeInfo = () => {
    switch (session.status) {
      case 'completed':
        return `Completed: ${formatTime(session.time_completed)}`;
      case 'in_progress':
        return `Started: ${formatTime(session.time_started)}`;
      default:
        return `Added: ${formatTime(session.time_added)}`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card mb-3 ${isDragging ? 'shadow-lg' : 'shadow-sm'}`}
    >
      <div className="card-body">
        <h6 className="card-title">{session.title}</h6>
        
        {session.description && (
          <p className="card-text text-muted small">{session.description}</p>
        )}

        <div className="small text-muted mb-2">
          <div>{getTimeInfo()}</div>
          {session.total_time_spent > 0 && (
            <div>Time spent: {session.total_time_spent}h</div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <select
            className="form-select form-select-sm"
            value={session.status}
            onChange={(e) => onStatusChange(session.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <span className={`badge bg-${session.status === 'completed' ? 'success' : session.status === 'in_progress' ? 'primary' : 'secondary'}`}>
            {session.status === 'completed' ? 'Done' : session.status === 'in_progress' ? 'In Progress' : 'Not Started'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubtopicCard;