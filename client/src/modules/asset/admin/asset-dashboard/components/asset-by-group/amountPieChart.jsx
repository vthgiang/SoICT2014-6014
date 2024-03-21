import React, { Component } from 'react'
import { connect } from 'react-redux'

import c3 from 'c3'
import 'c3/c3.css'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

class AmountPieChart extends Component {
  constructor(props) {
    super(props)
  }

  // Thiết lập dữ liệu biểu đồ
  setDataPieChart = () => {
    const { chartAsset, setAmountOfAsset } = this.props
    const { translate } = this.props

    let numberOfAsset = ''
    if (chartAsset) {
      numberOfAsset = chartAsset.map((value) => {
        return [translate(value[0]), value[1]]
      })

      if (setAmountOfAsset && JSON.stringify(numberOfAsset) !== JSON.stringify([])) {
        setAmountOfAsset(numberOfAsset)
      }
    }

    console.log('numberOfAsset: ', numberOfAsset)
    return numberOfAsset
  }

  // Xóa các chart đã render khi chưa đủ dữ liệu
  removePreviousChart() {
    const chart = this.refs.amountPieChart
    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  // Khởi tạo PieChart bằng C3
  pieChart = () => {
    if (this.setDataPieChart()) {
      let numberOfAsset = this.setDataPieChart()
      this.removePreviousChart()
      let chart = c3.generate({
        bindto: this.refs.amountPieChart,

        data: {
          columns: numberOfAsset,
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
        <section ref='amountPieChart'></section>
      </React.Fragment>
    )
  }
}

export default withTranslate(AmountPieChart)
