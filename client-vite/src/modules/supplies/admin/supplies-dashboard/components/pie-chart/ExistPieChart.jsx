import React, { Component } from 'react'
import { connect } from 'react-redux'

import c3 from 'c3'
import 'c3/c3.css'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

class ExistPieChart extends Component {
  constructor(props) {
    super(props)
  }

  // Thiết lập dữ liệu biểu đồ
  setDataPieChart = () => {
    const { existSupplies } = this.props
    const { translate } = this.props

    let numberOfSupplies = []
    for (let i = 0; i < existSupplies.length; i++) {
      numberOfSupplies.push([existSupplies[i].supplyName, existSupplies[i].price])
    }
    return numberOfSupplies
  }

  // Xóa các chart đã render khi chưa đủ dữ liệu
  removePreviousChart() {
    const chart = this.refs.existPieChart
    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  // Khởi tạo PieChart bằng C3
  pieChart = () => {
    if (this.setDataPieChart()) {
      let numberOfSupplies = this.setDataPieChart()
      this.removePreviousChart()
      let chart = c3.generate({
        bindto: this.refs.existPieChart,

        data: {
          columns: numberOfSupplies,
          type: 'donut'
        },

        pie: {
          label: {
            format: function (value, ratio, id) {
              return value
            }
          }
        },

        padding: {
          top: 20,
          bottom: 20,
          right: 20,
          left: 20
        },

        tooltip: {
          format: {
            title: function (d) {
              return d
            },
            value: function (value) {
              return value
            }
          }
        },

        legend: {
          show: true
        }
      })
    }
  }

  render() {
    this.pieChart()

    return (
      <React.Fragment>
        <section ref='existPieChart' />
      </React.Fragment>
    )
  }
}

export default withTranslate(ExistPieChart)
