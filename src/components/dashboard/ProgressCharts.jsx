import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressCharts = ({ learningGoals, analytics }) => {
  // Goals by Status Chart
  const statusData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [
          learningGoals.filter(g => g.status === 'completed').length,
          learningGoals.filter(g => g.status === 'in_progress').length,
          learningGoals.filter(g => g.status === 'not_started').length
        ],
        backgroundColor: ['#28a745', '#007bff', '#6c757d'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const statusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    cutout: '60%'
  };

  // Study Time Chart
  const studyData = {
    labels: analytics?.daily_study?.map(day => 
      new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
    ) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Hours Studied',
        data: analytics?.daily_study?.map(day => day.hours) || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(46, 125, 50, 0.7)',
        borderColor: 'rgba(46, 125, 50, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const studyOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      }
    }
  };

  return (
    <div className="card h-100">
      <div className="card-header bg-transparent">
        <h5 className="card-title mb-0">
          <i className="bi bi-graph-up me-2 text-primary"></i>
          Progress Overview
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Goals Status Chart */}
          <div className="col-md-6 mb-4">
            <h6 className="text-center mb-3">Goals by Status</h6>
            <div style={{ height: '200px' }}>
              <Doughnut data={statusData} options={statusOptions} />
            </div>
          </div>

          {/* Study Time Chart */}
          <div className="col-md-6">
            <h6 className="text-center mb-3">Weekly Study Time</h6>
            <div style={{ height: '200px' }}>
              <Bar data={studyData} options={studyOptions} />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row mt-4 text-center">
          <div className="col-4">
            <div className="border-end">
              <div className="h4 mb-1 text-success">
                {learningGoals.filter(g => g.status === 'completed').length}
              </div>
              <small className="text-muted">Completed</small>
            </div>
          </div>
          <div className="col-4">
            <div className="border-end">
              <div className="h4 mb-1 text-primary">
                {learningGoals.filter(g => g.status === 'in_progress').length}
              </div>
              <small className="text-muted">In Progress</small>
            </div>
          </div>
          <div className="col-4">
            <div className="h4 mb-1 text-muted">
              {learningGoals.filter(g => g.status === 'not_started').length}
            </div>
            <small className="text-muted">Not Started</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;