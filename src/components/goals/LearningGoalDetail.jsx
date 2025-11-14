import React from 'react';
import { useParams } from 'react-router-dom';

const LearningGoalDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h2>Learning Goal Detail - ID: {id}</h2>
                <p>This component will show detailed view of a learning goal with sessions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningGoalDetail;