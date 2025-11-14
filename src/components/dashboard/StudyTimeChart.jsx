import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudyTimeChart = ({ analytics }) => {
  const data = {
    labels: analytics?.daily_study?.map(day => new Date(day.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Hours Studied',
        data: analytics?.daily_study?.map(day => day.hours) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
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
      <div className="card-body">
        <h5 className="card-title">Daily Study Time (Last 7 Days)</h5>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default StudyTimeChart;