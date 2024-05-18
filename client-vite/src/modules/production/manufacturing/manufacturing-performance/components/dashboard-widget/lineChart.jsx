import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import WidgetTitle  from './widgetTitle';

ChartJS.register(  
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
ChartJS.defaults.font.family = "'Source Sans Pro', sans-serif";


const options = {
    animation: {
        animateScale: true
    },
    layout: {
      padding: 15
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
        }
      }
    }, scales: {
      x: {
        ticks: {
          color: "#333",
        },
      },
      y: {
        ticks: {
          color: "#333",
        },
      },
    },
    devicePixelRatio: 2,
    responsive: true,
    maintainAspectRatio: false
};

const LineChart = ({ title, value, target, labels, customize, onDelete, onRedirectToDetail }) => {
  const data = {
      labels: labels,
      datasets: [
        {
          label: "Actual",
          data: [1,2,3,4,5,6],
          backgroundColor: customize.color[0],
          borderColor: customize.color[0],
        },         
        {
          label: "Target",
          data: Array(value.length).fill(target),
          backgroundColor: customize.color[1],
          borderColor: customize.color[1],
        },
      ],
  }
  return (
    <div className="chart-wrapper">
      <WidgetTitle title={title} onDelete={onDelete} onRedirectToDetail={onRedirectToDetail} />
      <Line data={data} options={options} />
    </div>
  )
}

export default LineChart;
