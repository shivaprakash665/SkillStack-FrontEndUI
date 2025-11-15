import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SubtopicCard from './SubtopicCard';

const SubtopicBoard = ({ title, status, sessions, onStatusChange, onDelete, onNotesUpdate, color }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const getColorClass = () => {
    const colors = {
      secondary: 'border-left-secondary',
      primary: 'border-left-primary', 
      success: 'border-left-success',
      warning: 'border-left-warning'
    };
    return colors[color] || 'border-left-secondary';
  };

  // Count sessions with notes
  const sessionsWithNotes = sessions.filter(s => s.notes).length;
  const sessionsWithAISummary = sessions.filter(s => s.ai_summary).length;

  return (
    <div className="col-md-4 mb-4">
      <div className={`card h-100 border-left-3 ${getColorClass()}`}>
        <div className="card-header bg-transparent">
          <h5 className="card-title mb-0 d-flex justify-content-between align-items-center">
            <span>{title}</span>
            <div className="d-flex gap-2">
              {sessionsWithNotes > 0 && (
                <span className="badge bg-info" title={`${sessionsWithNotes} subtopics with notes`}>
                  <i className="bi bi-journal-text me-1"></i>
                  {sessionsWithNotes}
                </span>
              )}
              <span className="badge bg-secondary">{sessions.length}</span>
            </div>
          </h5>
        </div>
        <div 
          ref={setNodeRef}
          className={`card-body ${isOver ? 'bg-light' : ''}`}
          style={{ minHeight: '400px', transition: 'background-color 0.2s' }}
        >
          <SortableContext items={sessions.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {sessions.map(session => (
              <SubtopicCard
                key={session.id}
                session={session}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onNotesUpdate={onNotesUpdate}
              />
            ))}
          </SortableContext>
          
          {sessions.length === 0 && (
            <div className="text-center text-muted py-4">
              <i className="bi bi-inbox display-4"></i>
              <p className="mt-2">No subtopics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubtopicBoard;