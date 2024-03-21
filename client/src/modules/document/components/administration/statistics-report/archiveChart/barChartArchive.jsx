import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Tree } from '../../../../../../common-components'
import c3 from 'c3'
import 'c3/c3.css'

function BarChartArchive(props) {
  useEffect(() => {
    barChartDocumentInArchive()
  })
  const refArchives = React.createRef()
  function removePreviousArchiveChart() {
    const chart = refArchives.current
    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }
  const barChartDocumentInArchive = () => {
    removePreviousArchiveChart()
    let dataChart = { count: 0, shortName: [], type: [] }
    if (props.data) {
      dataChart = props.data.dataChart
    }

    let count = dataChart.count
    let heightCalc
    if (dataChart.type) {
      heightCalc = dataChart.type.length * 24.8
    }
    let height = heightCalc < 320 ? 320 : heightCalc
    let chart = c3.generate({
      bindto: refArchives.current,

      data: {
        columns: [count],
        type: 'bar',
        labels: true
      },

      padding: {
        top: 10,
        bottom: 20,
        right: 0,
        left: 100
      },

      axis: {
        x: {
          type: 'category',
          categories: dataChart.shortName,
          tick: {
            multiline: false
          }
        },
        y: {
          label: {
            text: 'Số lượng',
            position: 'outer-right'
          }
        },
        rotated: true
      },

      size: {
        height: height
      },

      color: {
        pattern: ['#1f77b4']
      },

      legend: {
        show: false
      },

      tooltip: {
        format: {
          title: function (index) {
            return dataChart.type[index]
          }
        }
      }
    })
  }
  return (
    <React.Fragment>
      <div ref={refArchives}></div>
    </React.Fragment>
  )
}

export default BarChartArchive
