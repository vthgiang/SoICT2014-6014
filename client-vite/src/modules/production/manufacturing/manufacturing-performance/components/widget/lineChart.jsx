import React from 'react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import WidgetTitle from './widgetTitle'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
ChartJS.defaults.font.family = "'Source Sans Pro', sans-serif"

const options = {
  animation: {
    animateScale: true
  },
  layout: {
    padding: 15
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#333'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#333'
      },
    },
    y: {
      ticks: {
        color: '#333',
      },
      min: 0
    }
  },
  lineThickness: 0.5,
  devicePixelRatio: 2,
  responsive: true,
  maintainAspectRatio: false
}

const LineChart = ({ 
  title, 
  values = [], 
  target, 
  labels, 
  customize, 
  editMode, 
  onDelete, 
  onRedirectToDetail 
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Thực hiện',
        data: values,
        backgroundColor: customize.theme[0],
        borderColor: customize.theme[0],
        borderWidth: 2,
        pointRadius: 2
      },
      {
        label: 'Mục tiêu',
        data: Array(values.length).fill(target),
        backgroundColor: customize.theme[1],
        borderColor: customize.theme[1],
        borderWidth: 2,
        pointRadius: 2
      }
    ]
  }
  return (
    <div className={`chart-wrapper ${editMode ? 'editMode' : ''}`}>
      <WidgetTitle title={title} editMode={editMode} onDelete={onDelete} onRedirectToDetail={onRedirectToDetail} />
      <Line data={data} options={options} />
    </div>
  )
}

export default LineChart
