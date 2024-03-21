import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { createKpiSetActions } from '../../creation/redux/actions'

import { DatePicker, CustomLegendC3js } from '../../../../../common-components'

import c3 from 'c3'
import 'c3/c3.css'

function DistributionOfEmployeeKpiChart(props) {
  const { translate, createEmployeeKpiSet } = props
  const refKpiSet = React.createRef()

  let d = new Date(),
    monthToday = d.getMonth() + 1,
    year = d.getFullYear()
  let endMonth

  if (monthToday < 10) {
    endMonth = '0' + monthToday
  } else {
    endMonth = monthToday
  }

  const [state, setState] = useState({
    defaultDate: [endMonth, year].join('-'),
    month: [year, endMonth].join('-'),
    currentRole: localStorage.getItem('currentRole')
  })
  const { currentRole, month, defaultDate } = state

  let currentEmployeeKpiSet

  useEffect(() => {
    // Lấy Kpi của cá nhân hiện tại
    props.getEmployeeKpiSet({
      roleId: currentRole,
      month: month
    })
  }, [])

  useEffect(() => {
    let data = pieChart(createEmployeeKpiSet)

    setState({
      ...state,
      chart: data?.chart,
      dataPieChart: data?.dataPieChart
    })
  }, [props.createEmployeeKpiSet.currentKPI])

  useEffect(() => {
    props.getEmployeeKpiSet({
      roleId: currentRole,
      month: state.month
    })
  }, [state.month])

  /**Thiết lập dữ liệu biểu đồ */
  const setDataPieChart = (createEmployeeKpiSet) => {
    let listEmployeeKpi, dataPieChart
    if (createEmployeeKpiSet?.currentKPI?.kpis) {
      listEmployeeKpi = createEmployeeKpiSet.currentKPI.kpis
    }
    if (listEmployeeKpi) {
      dataPieChart = listEmployeeKpi.map((x) => {
        return [x.name, x.weight]
      })
    }
    return dataPieChart
  }

  /**Xóa các chart đã render khi chưa đủ dữ liệu */
  function removePreviousChart() {
    const chart = refKpiSet.current
    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  /**Khởi tạo PieChart bằng C3 */
  const pieChart = (createEmployeeKpiSet) => {
    removePreviousChart()

    // Tạo mảng dữ liệu
    let chart
    let dataPieChart = setDataPieChart(createEmployeeKpiSet)

    if (dataPieChart) {
      chart = c3.generate({
        bindto: refKpiSet.current, // Đẩy chart vào thẻ div có id="pieChart"

        // Căn lề biểu đồ
        padding: {
          top: 20,
          bottom: 20,
          right: 20,
          left: 20
        },

        data: {
          // Dữ liệu biểu đồ
          columns: dataPieChart,
          type: 'pie'
        },

        legend: {
          show: false
        }
      })
    }

    return {
      chart,
      dataPieChart
    }
  }

  const handleSelectMonth = async (value) => {
    let month = value.slice(3, 7) + '-' + value.slice(0, 2)
    setState({
      ...state,
      month: month
    })
  }

  if (createEmployeeKpiSet) {
    currentEmployeeKpiSet = createEmployeeKpiSet.currentKPI
  }

  return (
    <React.Fragment>
      <section className='form-inline'>
        <div className='form-group'>
          <label>{translate('kpi.organizational_unit.dashboard.month')}</label>
          <DatePicker
            id='monthDistributionOfEmployeeKpiChart'
            dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
            value={defaultDate} // giá trị mặc định cho datePicker
            onChange={handleSelectMonth}
            disabled={false} // sử dụng khi muốn disabled, mặc định là false
          />
        </div>
      </section>

      {currentEmployeeKpiSet ? (
        <section id={'distributionOfEmployeeKpi'} className='c3-chart-container'>
          <div ref={refKpiSet}></div>
          <CustomLegendC3js
            chart={state.chart}
            chartId={'distributionOfEmployeeKpi'}
            legendId={'distributionOfEmployeeKpiLegend'}
            title={`${translate('kpi.evaluation.employee_evaluation.KPI_list')} (${currentEmployeeKpiSet.kpis && currentEmployeeKpiSet.kpis.length})`}
            dataChartLegend={state.dataPieChart && state.dataPieChart.map((item) => item[0])}
          />
        </section>
      ) : (
        <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
      )}
    </React.Fragment>
  )
}

function mapState(state) {
  const { createEmployeeKpiSet } = state
  return { createEmployeeKpiSet }
}

const actions = {
  getEmployeeKpiSet: createKpiSetActions.getEmployeeKpiSet
}

const connectedDistributionOfEmployeeKpiChart = connect(mapState, actions)(withTranslate(DistributionOfEmployeeKpiChart))
export { connectedDistributionOfEmployeeKpiChart as DistributionOfEmployeeKpiChart }
