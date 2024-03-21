import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'

import c3 from 'c3'
import 'c3/c3.css'

function ProgressKpiUnitChart(props) {
  const { data } = props
  const refMultiLineChart = React.createRef()

  useEffect(() => {
    // const revenue = ['Doanh thu'];
    // const cost = ['Chi phí'];
    // const profit = ['Lợi nhuận'];
    // const labels = [];
    // for (let item of data) {
    //     revenue.push(item.revenue);
    //     cost.push(item.cost);
    //     profit.push(item.profit);
    //     labels.push(item.date)
    // }
    multiLineChart()
  }, [])

  const removePreviosMultiLineChart = () => {
    const chart = refMultiLineChart.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const multiLineChart = () => {
    removePreviosMultiLineChart()
    const { translate } = props

    // let dataMultiLineChart = setDataMultiLineChart();

    let chart = c3.generate({
      bindto: refMultiLineChart.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },
      data: {
        columns: [
          ['Tiến độ', 30, 20, 50, 40, 60, 50],
          ['Mục tiêu', 45, 45, 45, 45, 45, 45]
        ],
        type: 'bar',
        types: {
          'Mục tiêu': 'line'
        }
      },

      axis: {
        x: {
          type: 'category',
          // categories: labels,
          rotate: true
        }
      },

      zoom: {
        enabled: false
      }
    })
  }

  const { translate } = props

  return (
    <React.Fragment>
      <section ref={refMultiLineChart}></section>
    </React.Fragment>
  )
}

function mapState(state) {
  const { createKpiUnit } = state
  return { createKpiUnit }
}

const actions = {
  // getAllOrganizationalUnitKpiSetByTime: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTime
}

const connectedProgressKpiUnit = connect(mapState, actions)(withTranslate(ProgressKpiUnitChart))
export { connectedProgressKpiUnit as ProgressKpiUnitChart }
