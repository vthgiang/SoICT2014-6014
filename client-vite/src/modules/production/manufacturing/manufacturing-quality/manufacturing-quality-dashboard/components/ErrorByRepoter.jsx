import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, layouts } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { connect } from 'react-redux'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  indexAxis: 'y',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#000'
      }
    }
  },
  scales: {
    y: {
      ticks: {
        display: true,
        beginAtZero: true,
        color: '#000'
      },
      grid: {
        drawBorder: false,
        display: false
      }
    }
  },
  maintainAspectRatio: false,
  responsive: true
}

const ErrorByRepoter = (props) => {
  const { qualityDasboard } = props
  const { errorNumByReporter } = qualityDasboard

  const data = {
    labels: Object.keys(errorNumByReporter),
    datasets: [
      {
        label: 'Số lỗi được báo cáo',
        data: Object.values(errorNumByReporter),
        backgroundColor: 'rgba(40, 167, 69, 0.4)',
        borderColor: 'rgba(40, 167, 69)',
        borderWidth: 1
      }
    ]
  }

  return (
    <div style={{ height: '350px', padding: '10px' }}>
      <Bar options={options} data={data} />
    </div>
  )
}

function mapStateToProps(state) {
  const { qualityDasboard } = state
  return { qualityDasboard }
}

export default connect(mapStateToProps, null)(ErrorByRepoter)
