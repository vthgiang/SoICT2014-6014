import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SalesOrderActions } from '../../sales-order/redux/actions'

import c3 from 'c3'
import 'c3/c3.css'

function TopSoldBarChart(props) {
  const topSoldBarChart = React.createRef()

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole')
  })

  useEffect(() => {
    barChart()
  }, [props.salesOrders])

  const setDataBarChart = () => {
    let topGoodsSoldValue = ['Top sản phẩm bán chạy theo số lượng']

    if (props.salesOrders && props.salesOrders.topGoodsSold) {
      let topGoodsSoldMap = props.salesOrders.topGoodsSold.map((element) => element.quantity)
      topGoodsSoldValue = topGoodsSoldValue.concat(topGoodsSoldMap)
    }
    let dataBarChart = {
      columns: [topGoodsSoldValue && topGoodsSoldValue.length ? topGoodsSoldValue.slice(0, 6) : []],
      type: 'bar'
    }
    return dataBarChart
  }

  const removePreviousChart = () => {
    const chart = topSoldBarChart.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const barChart = () => {
    let dataBarChart = setDataBarChart()

    let topGoodsSoldTitle = []
    if (props.salesOrders && props.salesOrders?.topGoodsSold) {
      topGoodsSoldTitle = props.salesOrders?.topGoodsSold.map((element) => element.name)
    }

    removePreviousChart()

    let chart = c3.generate({
      bindto: topSoldBarChart.current,
      data: dataBarChart,
      bar: {
        width: {
          ratio: 0.5
        }
      },
      axis: {
        y: {
          label: {
            text: 'Đơn vị tính',
            position: 'outer-middle'
          }
        },
        x: {
          type: 'category',
          categories: topGoodsSoldTitle && topGoodsSoldTitle.length ? topGoodsSoldTitle.slice(0, 6) : []
        }
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

  return (
    <div className='box'>
      <div className='box-header with-border'>
        <i className='fa fa-bar-chart-o' />
        <h3 className='box-title'>Top sản phẩm bán chạy (theo số lượng)</h3>
        <div ref={topSoldBarChart} id='topSoldBarChart'></div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { salesOrders } = state
  return { salesOrders }
}

const mapDispatchToProps = {
  getTopGoodsSold: SalesOrderActions.getTopGoodsSold
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TopSoldBarChart))
