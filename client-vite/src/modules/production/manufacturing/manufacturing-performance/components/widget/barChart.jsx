import React from 'react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import WidgetTitle from './widgetTitle'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
      stacked: true,
      ticks: {
        color: '#333'
      }
    },
    y: {
      stacked: true,
      ticks: {
        color: '#333'
      }
    }
  },
  devicePixelRatio: 2,
  responsive: true,
  maintainAspectRatio: false
}

const BarChart = ({
  title, 
  labels, 
  values = [], 
  customize, 
  editMode, 
  onDelete, 
  onRedirectToDetail 
}) => {
  const data = {
    labels,
    datasets: {
      label: 'Actual',
      data: values,
      backgroundColor: customize.theme[0],
      borderColor: customize.theme[0]
    }
  }

  return (
    <div className='chart-wrapper'>
      <WidgetTitle title={title} editMode={editMode} onDelete={onDelete} onRedirectToDetail={onRedirectToDetail} />
      <Bar options={options} data={data} />
    </div>
  )
}

export default BarChart
