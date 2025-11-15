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
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import SubtopicBoard from './SubtopicBoard';
import SubtopicCard from './SubtopicCard';
import AddSubtopicModal from './AddSubtopicModal';
import CertificateUpload from './CertificateUpload';
import LoadingSpinner from '../common/LoadingSpinner';
import './LearningGoalDetail.css';

const LearningGoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchGoalData();
    fetchSessions();
    fetchAnalytics();
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
        fetchGoalData(); // Refresh goal progress
      } else {
        setError(data.error || 'Failed to update status');
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

      // Update order in backend
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

  if (error) {
    return (
      <div className="min-vh-100 bg-light py-4">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <button 
                      className="btn btn-outline-secondary btn-sm mb-3"
                      onClick={() => navigate('/goals')}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Goals
                    </button>
                    <h1 className="h2 mb-2">{goal?.title}</h1>
                    {goal?.description && (
                      <p className="text-muted mb-3">{goal.description}</p>
                    )}
                    <div className="d-flex gap-3 flex-wrap">
                      <span className="badge bg-primary">{goal?.resource_type}</span>
                      <span className="badge bg-secondary">{goal?.platform}</span>
                      <span className="badge bg-info">{goal?.category}</span>
                    </div>
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

                {/* Analytics */}
                {analytics && (
                  <div className="row mt-4">
                    <div className="col-md-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <h5 className="card-title">Total Time</h5>
                          <h3 className="text-primary">{analytics.total_time_spent}h</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <h5 className="card-title">Avg Time/Subtopic</h5>
                          <h3 className="text-info">{analytics.average_time_per_session}h</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-light">
                        <div className="card-body text-center">
                          <h5 className="card-title">Completion</h5>
                          <h3 className="text-success">{analytics.completion_percentage}%</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button 
                        className="btn btn-primary w-100 h-100"
                        onClick={() => setShowAddModal(true)}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Subtopic
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <div className="row">
            <SubtopicBoard
              title="Not Started"
              status="not_started"
              sessions={getSessionsByStatus('not_started')}
              onStatusChange={handleStatusChange}
              color="secondary"
            />
            <SubtopicBoard
              title="In Progress"
              status="in_progress"
              sessions={getSessionsByStatus('in_progress')}
              onStatusChange={handleStatusChange}
              color="primary"
            />
            <SubtopicBoard
              title="Completed"
              status="completed"
              sessions={getSessionsByStatus('completed')}
              onStatusChange={handleStatusChange}
              color="success"
            />
          </div>
          
          <DragOverlay>
            {activeSession ? (
              <SubtopicCard 
                session={activeSession} 
                onStatusChange={handleStatusChange}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Certificate Upload - Show when goal is completed */}
        {goal?.status === 'completed' && (
          <div className="row mt-4">
            <div className="col-12">
              <CertificateUpload goalId={goal.id} />
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
    </div>
  );
};

export default LearningGoalDetail;