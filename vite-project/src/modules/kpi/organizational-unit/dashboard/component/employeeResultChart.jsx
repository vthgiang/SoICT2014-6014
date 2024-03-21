import { Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip } from 'chart.js'
import React, { useEffect, useState } from 'react'
import { Radar } from 'react-chartjs-2'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// random màu cho chart
const generateColor = () => {
  let x = Math.random() * 255
  let y = Math.random() * 255
  let z = Math.random() * 255
  return {
    bgColor: `rgba(${x}, ${y}, ${z}, 0.2)`,
    color: `rgba(${x}, ${y}, ${z}, 1)`
  }
}

const EmployeeResultChart = (props) => {
  const { employeeKpi, unitKpi } = props
  const [data, setData] = useState()

  useEffect(() => {
    let chartLabels = []
    let chartData = []

    if (unitKpi?.kpis) {
      for (let item of unitKpi.kpis) {
        if (typeof item.target === 'number') {
          chartLabels.push(item.name)
        }
      }
    }

    if (employeeKpi) {
      for (let kpi of employeeKpi) {
        let data = []
        if (kpi?.kpis) {
          for (let item of kpi.kpis) {
            if (typeof item.target === 'number') {
              if (chartLabels.includes(item.name)) {
                let progress = Math.round((item.current / item.target) * 100)
                progress = progress > 100 ? 100 : progress
                data.push(progress)
              } else {
                data.push(0)
              }
            }
          }
        }
        let color = generateColor()
        chartData.push({
          label: kpi.creator.name,
          data: data,
          backgroundColor: color.bgColor,
          borderColor: color.color,
          borderWidth: 1
        })
      }
    }

    setData({
      labels: chartLabels,
      datasets: chartData
    })
  }, [employeeKpi, unitKpi])

  return (
    <React.Fragment>
      <div className='padding-10'>
        {data && <Radar data={data} height={'500px'} width={'500px'} options={{ maintainAspectRatio: false }} />}
      </div>
    </React.Fragment>
  )
}

const mapState = (state) => {}

const actions = {}

const connectedEmployeeResultChart = connect(mapState, actions)(withTranslate(EmployeeResultChart))
export { connectedEmployeeResultChart as EmployeeResultChart }
