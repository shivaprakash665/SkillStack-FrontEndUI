import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ learningGoals }) => {
  const data = {
    labels: ['Not Started', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          learningGoals.filter(g => g.status === 'not_started').length,
          learningGoals.filter(g => g.status === 'in_progress').length,
          learningGoals.filter(g => g.status === 'completed').length
        ],
        backgroundColor: ['#6c757d', '#007bff', '#28a745'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">Goals Progress</h5>
        <div className="doughnut-container">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;