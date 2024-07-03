import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const options = {
  scales: {
    r: {
      ticks: {
        display: true,
      },
      pointLabels: {
        font: {
          size: 9, // Adjust the label font size
          weight: 600
        },
        position: 'out', // Adjust the position if needed
        color: '#000', // Adjust the label color,
        display: false
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
  },

};

export function KPIEmployees({ data }) {
  return (
    <div className='w-full max-h-[650px] flex justify-center'>
      <Radar data={data} options={options} />
    </div>
  );
}
