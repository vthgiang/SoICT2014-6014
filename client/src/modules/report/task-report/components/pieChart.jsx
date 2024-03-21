import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3'
import 'c3/c3.css'
import './transferList.css'
import { chartFunction } from './chart'

function PieChart(props) {
  const [state, setstate] = useState({
    pieChart: false
  })

  const refPieChart = createRef()

  useEffect(() => {
    if (props.dataForAxisXInChart && props.namePieChart && props.pieChartData) {
      let { pieChartData } = props
      setstate({
        ...state,
        startDate: pieChartData[0][0].slice(0, 6),
        endDate: pieChartData[pieChartData.length - 1][0].slice(0, 6),
        namePieChart: props.namePieChart,
        dataForAxisXInChart:
          props.dataForAxisXInChart.length > 0 &&
          props.dataForAxisXInChart.map((x, index) => (index ? '-> ' : '') + chartFunction.formatDataForAxisXInChart(x))
      })
    }
  }, [JSON.stringify(props.pieChartData)])

  useEffect(() => {
    if (props.pieChartData) {
      renderPieChart(nextProps.pieChartData)
    }
  }, [props.pieChartData])

  useEffect(() => {
    if (props.pieChartData) {
      renderPieChart(props.pieChartData)
    }
  }, [])

  // Xóa các  Piechart đã render khi chưa đủ dữ liệu
  function removePrceviousPieChart() {
    const chart = refPieChart.current
    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  renderPieChart = (data) => {
    removePrceviousPieChart()
    let chart = c3.generate({
      bindto: refPieChart.current,
      // Căn lề biểu đồ

      size: {
        height: 350,
        width: 480
      },
      data: {
        columns: data,
        type: 'pie'
      },
      legend: {
        position: data.length > 6 ? 'right' : 'bottom',
        // position: 'right',
        show: true
      }
    })
  }

  const { namePieChart, startDate, endDate, dataForAxisXInChart } = state
  return (
    <React.Fragment>
      <div className='box box-primary'>
        <div className='box-header with-border'>
          <h4 className='box-title report-title'>
            <span style={{ marginRight: '7px' }}>Trường thông tin:</span>
            {namePieChart ? namePieChart + ' ' : ''}
          </h4>
          <br />
          <h4 className='box-title report-title' style={{ marginTop: '5px' }}>
            <span style={{ marginRight: '7px' }}>Thống kê từ:</span>
            {`${startDate}`} đến {`${endDate}`}
          </h4>
          <br />
          <h4 className='box-title report-title' style={{ marginTop: '5px' }}>
            <span style={{ marginRight: '7px' }}>Chiều dữ liệu:</span>{' '}
            {`${dataForAxisXInChart && dataForAxisXInChart.length > 0 ? dataForAxisXInChart.join(' ') : 'Thời gian'}`}
          </h4>
        </div>
        <div className='box-body report-box'>
          <div ref={refPieChart}></div>
        </div>
      </div>
    </React.Fragment>
  )
}

const pieChart = connect(null, null)(withTranslate(PieChart))
export { pieChart as PieChart }
