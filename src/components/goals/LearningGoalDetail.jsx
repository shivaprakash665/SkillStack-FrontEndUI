import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import SubtopicBoard from './SubtopicBoard';
import SubtopicCard from './SubtopicCard';
import AddSubtopicModal from './AddSubtopicModal';
import CertificateUpload from './CertificateUpload';
import LoadingSpinner from '../common/LoadingSpinner';

const LearningGoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isSticky, setIsSticky] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchGoalData();
    fetchSessions();
    fetchAnalytics();
    
    // Add scroll event listener for sticky header
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const fetchGoalData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/goals/${id}?user_id=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setGoal(data.learning_goal);
      } else {
        throw new Error(data.error || 'Failed to fetch goal');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/goals/${id}/sessions?user_id=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSessions(data.sessions || []);
      } else {
        throw new Error(data.error || 'Failed to fetch sessions');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/goals/${id}/analytics?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleAddSubtopic = async (subtopicData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/goals/${id}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...subtopicData,
          user_id: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSessions(prev => [...prev, data.session]);
        setShowAddModal(false);
        fetchAnalytics();
        fetchGoalData();
        setMessage('Subtopic added successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to create subtopic');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/sessions/${sessionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          user_id: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? data.session : session
        ));
        fetchAnalytics();
        fetchGoalData();
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleManualComplete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/goals/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setGoal(data.learning_goal);
        fetchAnalytics();
        fetchSessions();
        setMessage('Goal marked as completed successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to complete goal');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const deleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this subtopic? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/learning/sessions/${sessionId}?user_id=${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        fetchAnalytics();
        fetchGoalData();
        setMessage('Subtopic deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to delete subtopic');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const deleteGoal = async () => {
    if (!window.confirm('Are you sure you want to delete this learning goal? All subtopics and data will be permanently deleted.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/learning/goals/${id}?user_id=${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/goals');
      } else {
        setError(data.error || 'Failed to delete learning goal');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleNotesUpdate = async (sessionId, notes, aiSummary) => {
    try {
      const response = await fetch(`http://localhost:5000/api/learning/sessions/${sessionId}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: notes,
          ai_summary: aiSummary,
          user_id: user.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? data.session : session
        ));
        setMessage('Notes updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update notes');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeSession = sessions.find(s => s.id === active.id);
    const overSession = sessions.find(s => s.id === over.id);

    if (!activeSession || !overSession) return;

    const oldIndex = sessions.findIndex(s => s.id === active.id);
    const newIndex = sessions.findIndex(s => s.id === over.id);

    if (oldIndex !== newIndex) {
      const newSessions = arrayMove(sessions, oldIndex, newIndex);
      setSessions(newSessions);

      try {
        await fetch(`http://localhost:5000/api/learning/sessions/${active.id}/order`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_index: newIndex,
            user_id: user.id
          })
        });
      } catch (error) {
        console.error('Failed to update order:', error);
      }
    }

    setActiveSession(null);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const session = sessions.find(s => s.id === active.id);
    setActiveSession(session);
  };

  const getSessionsByStatus = (status) => {
    return sessions.filter(session => session.status === status);
  };

  if (loading) {
    return <LoadingSpinner text="Loading learning goal..." />;
  }

  return (
    <div className="learning-goal-detail fade-in">
      {/* Sticky Header */}
      <div className={`card mb-4 ${isSticky ? 'sticky-header' : ''}`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <button 
                className="btn btn-outline-secondary btn-sm mb-3"
                onClick={() => navigate('/goals')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Goals
              </button>
              <h1 className="h3 mb-2">{goal?.title}</h1>
              {goal?.description && (
                <p className="text-muted mb-3">{goal.description}</p>
              )}
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-primary">{goal?.resource_type}</span>
                <span className="badge bg-secondary">{goal?.platform}</span>
                <span className="badge bg-info">{goal?.category}</span>
                <span className={`badge ${
                  goal?.status === 'completed' ? 'bg-success' : 
                  goal?.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'
                }`}>
                  {goal?.status === 'completed' ? 'Completed' : 
                   goal?.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                </span>
                {goal?.expected_end_date && (
                  <span className="badge bg-warning">
                    <i className="bi bi-calendar me-1"></i>
                    Due: {new Date(goal.expected_end_date).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Manual Completion Button */}
              {goal?.status !== 'completed' && (
                <div className="mt-3">
                  <button 
                    className="btn btn-success btn-sm me-2"
                    onClick={handleManualComplete}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Mark Goal as Completed
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={deleteGoal}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Delete Goal
                  </button>
                  <small className="text-muted d-block mt-1">
                    Use this if you've completed the goal outside the system
                  </small>
                </div>
              )}
            </div>
            <div className="text-end">
              <div className="progress mb-2" style={{ width: '200px', height: '20px' }}>
                <div 
                  className="progress-bar" 
                  style={{ width: `${goal?.progress_percentage || 0}%` }}
                >
                  {goal?.progress_percentage}%
                </div>
              </div>
              <p className="text-muted mb-0">
                {analytics?.completed_sessions || 0} of {analytics?.total_sessions || 0} subtopics completed
              </p>
            </div>
          </div>

          {message && (
            <div className="alert alert-success" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Analytics */}
          {analytics && (
            <div className="row mt-4">
              <div className="col-md-3">
                <div className="card bg-light border-0">
                  <div className="card-body text-center py-3">
                    <h5 className="card-title text-muted small">Total Time</h5>
                    <h3 className="text-primary mb-0">{analytics.total_time_spent}h</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-light border-0">
                  <div className="card-body text-center py-3">
                    <h5 className="card-title text-muted small">Avg Time/Subtopic</h5>
                    <h3 className="text-info mb-0">{analytics.average_time_per_session}h</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-light border-0">
                  <div className="card-body text-center py-3">
                    <h5 className="card-title text-muted small">Completion</h5>
                    <h3 className="text-success mb-0">{analytics.completion_percentage}%</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <button 
                  className="btn btn-primary w-100 h-100 d-flex align-items-center justify-content-center"
                  onClick={() => setShowAddModal(true)}
                  style={{ minHeight: '80px' }}
                >
                  <div>
                    <i className="bi bi-plus-circle display-6 d-block mb-2"></i>
                    <span>Add Subtopic</span>
                  </div>
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          modifiers={[restrictToVerticalAxis]}
        >
          <div className="row">
            <SubtopicBoard
              title="Not Started"
              status="not_started"
              sessions={getSessionsByStatus('not_started')}
              onStatusChange={handleStatusChange}
              onDelete={deleteSession}
              onNotesUpdate={handleNotesUpdate}
              color="secondary"
            />
            <SubtopicBoard
              title="In Progress"
              status="in_progress"
              sessions={getSessionsByStatus('in_progress')}
              onStatusChange={handleStatusChange}
              onDelete={deleteSession}
              onNotesUpdate={handleNotesUpdate}
              color="primary"
            />
            <SubtopicBoard
              title="Completed"
              status="completed"
              sessions={getSessionsByStatus('completed')}
              onStatusChange={handleStatusChange}
              onDelete={deleteSession}
              onNotesUpdate={handleNotesUpdate}
              color="success"
            />
          </div>
          
          <DragOverlay>
            {activeSession ? (
              <div style={{ transform: 'rotate(5deg)', opacity: 0.8 }}>
                <SubtopicCard 
                  session={activeSession} 
                  onStatusChange={handleStatusChange}
                  onDelete={deleteSession}
                  onNotesUpdate={handleNotesUpdate}
                  isDragging
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Certificate Upload */}
      {(goal?.status === 'completed' || analytics?.completion_percentage === 100) && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-success">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-award me-2"></i>
                  Congratulations! Goal Completed
                </h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  You've successfully completed this learning goal! Upload your certificate to commemorate this achievement.
                </p>
                <CertificateUpload goalId={goal.id} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subtopic Modal */}
      {showAddModal && (
        <AddSubtopicModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddSubtopic}
        />
      )}
    </div>
  );
};

export default LearningGoalDetail;