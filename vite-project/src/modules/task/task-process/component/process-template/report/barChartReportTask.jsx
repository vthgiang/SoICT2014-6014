import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker } from '../../../../../../common-components'
import { TaskProcessActions } from '../../../redux/actions'
import { TaskProcessService } from '../../../redux/services'
import c3 from 'c3'
import 'c3/c3.css'
import { useRef } from 'react'

function BarChartReportTask(props) {
  useEffect(() => {
    barChart()
  })
  const refContainer = useRef(props.code)
  function removePreviousBarChart() {
    const chart = refContainer.current
    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }
  const [view, setView] = useState(false)
  const changeView = () => {
    setView(!view)
  }
  const barChart = () => {
    removePreviousBarChart()

    let x = props.data.dataY ? props.data.dataY : []

    let dataChart = view ? (props.data.dataX2 ? [props.data.dataX2] : []) : props.data.dataX ? [props.data.dataX] : []
    let chart = c3.generate({
      bindto: refContainer.current,

      // Căn lề biểu đồ
      padding: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      },
      axis: {
        x: {
          type: 'category',
          categories: x,
          tick: {
            multiline: false
          }
        },
        y: {
          label: {
            text: 'y axis',
            position: 'outer middle'
          },
          tick: {
            multiline: false
          }
        }
        //  rotated: true
      },
      data: {
        columns: dataChart,
        type: 'bar',
        labels: true
      }
    })
  }

  return (
    <React.Fragment>
      <p>Biểu Đồ thời gian công việc : {props.data.name}</p>
      <div className='box-tools pull-right'>
        <div className='btn-group pull-right'>
          <button type='button' className={`btn btn-xs ${view ? 'active' : 'btn-danger'}`} onClick={changeView}>
            Theo giờ hành chính
          </button>
          <button type='button' className={`btn btn-xs ${view ? 'btn-danger' : 'active'}`} onClick={changeView}>
            Theo bấm giờ
          </button>
        </div>
      </div>
      <div ref={refContainer}></div>
    </React.Fragment>
  )
}

function mapState(state) {
  //const { user, auth, role, taskProcess } = state;
  return {}
}

const actionCreators = {
  //getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
  //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
}
const connectedBarChartReportTask = connect(mapState, actionCreators)(withTranslate(BarChartReportTask))
export { connectedBarChartReportTask as BarChartReportTask }
