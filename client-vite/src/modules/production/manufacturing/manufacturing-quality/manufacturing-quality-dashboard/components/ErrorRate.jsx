import React from 'react'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { keys } from 'lodash'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const options = {
  scales: {
    r: {
      ticks: {
        display: true,
        stepSize: 5
      },
      pointLabels: {
        font: {
          size: 12,
          weight: 500
        },
        color: '#333'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  },
  lineThickness: 1,
  maintainAspectRatio: false
}

const ErrorRate = (props) => {
  const { qualityDasboard, translate } = props
  const { errorNumByGroup } = qualityDasboard

  const keys = ['man', 'machine', 'material', 'measurement', 'method', 'enviroment']
  const labels = keys.map((key) => translate(`manufacturing.quality.error_groups.${key}`))
  const values = keys.map((key) => errorNumByGroup[key] * 10 || 0)
  values[5] = 10
  values [1] = 30
  const data = {
    labels,
    datasets: [
      {
        label: 'Lỗi theo nhóm',
        data: values,
        backgroundColor: 'rgba(220, 53, 69, 0.4)',
        borderColor: 'rgb(220, 53, 69)',
        pointBackgroundColor: 'rgb(220, 53, 69)',
        pointBorderWidth: 0,
        borderWidth: 1,
        pointRadius: 0
      }
    ]
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '350px', padding: '20px' }}>
      <Radar data={data} options={options} />
    </div>
  )
}

function mapStateToProps(state) {
  const { qualityDasboard } = state
  return { qualityDasboard }
}

export default connect(mapStateToProps, null)(withTranslate(ErrorRate))
