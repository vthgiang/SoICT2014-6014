import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import c3 from 'c3'
import 'c3/c3.css'
import './style.css'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

function QuantityNorm(props) {
  const refBarChart = React.createRef()

  useEffect(() => {
    barChart()
  }, [props.dataForChart])

  // Khởi tạo BarChart bằng C3
  const barChart = () => {
    const { dataForChart, title } = props
    c3.generate({
      bindto: refBarChart.current,
      data: {
        x: 'x',
        columns: [title, dataForChart],
        type: 'bar',
        labels: true
      },
      // grid: {
      //     y: {
      //         lines: [{ value: 100, class: 'grid500', text: 'MIN 100' }, { value: 500, class: 'grid500', text: 'MAX 500' }]
      //     }
      // },
      axis: {
        x: {
          type: 'category',
          tick: {
            rotate: 0,
            multiline: false
          },
          height: 100
        }
      }
    })
  }

  barChart()
  return (
    <React.Fragment>
      <h3 className='box-title' style={{ padding: '0.7em 35%' }}>
        {'Số lượng tồn kho theo thời gian của từng mặt hàng'}
      </h3>
      <div ref={refBarChart}></div>
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(QuantityNorm))
