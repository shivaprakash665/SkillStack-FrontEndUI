import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SubtopicCard from './SubtopicCard';

const SubtopicBoard = ({ title, status, sessions, onStatusChange, color }) => {
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

  return (
    <div className="col-md-4 mb-4">
      <div className={`card h-100 border-left-3 ${getColorClass()}`}>
        <div className="card-header bg-transparent">
          <h5 className="card-title mb-0 d-flex justify-content-between align-items-center">
            <span>{title}</span>
            <span className="badge bg-secondary">{sessions.length}</span>
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