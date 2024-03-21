/* Biểu đồ xu làm thêm giờ của nhân viên */
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { SelectMulti, DatePicker } from '../../../../common-components'
import { getEmployeeDashboardActions } from '../redux/actions'

import { showListInSwal } from '../../../../helpers/showListInSwal'

import c3 from 'c3'
import 'c3/c3.css'
import Swal from 'sweetalert2'

const TrendOfOvertime = (props) => {
  const { translate, childOrganizationalUnit, idUnits, unitName, employeeDashboardData, search_data_props } = props

  const [state, setState] = useState({
    lineChart: false,
    startDate: search_data_props.searchData.current.startDateTrendOfOvertimeChart,
    startDateShow: search_data_props.searchData.current.startDateTrendOfOvertimeChart,
    endDate: search_data_props.searchData.current.endDateTrendOfOvertimeChart,
    endDateShow: search_data_props.searchData.current.endDateTrendOfOvertimeChart,
    organizationalUnitsSearch: props.defaultUnit ? props.organizationalUnits : [],
    organizationalUnits: props.defaultUnit ? props.organizationalUnits : [],
    trendOfOvertimeChartData: employeeDashboardData.trendOfOvertimeChartData?.data1
      ? { ratioX: employeeDashboardData.trendOfOvertimeChartData.ratioX, data1: employeeDashboardData.trendOfOvertimeChartData.data1 }
      : { ratioX: [], data1: [] }
  })

  const barChart = useRef(null)

  const formatNewDate = (date) => {
    let partDate = date.split('-')
    return [partDate[1], partDate[0]].join('-')
  }

  useEffect(() => {
    setState({
      ...state,
      trendOfOvertimeChartData: {
        ratioX: employeeDashboardData.trendOfOvertimeChartData.ratioX,
        data1: employeeDashboardData.trendOfOvertimeChartData.data1
      }
    })
  }, [employeeDashboardData.trendOfOvertimeChartData.ratioX, employeeDashboardData.trendOfOvertimeChartData.data1])

  const { lineChart, nameChart, nameData1, startDate, endDate, startDateShow, endDateShow, organizationalUnits } = state
  const { trendOfOvertimeChartData } = state

  useEffect(() => {
    let ratioX = [...trendOfOvertimeChartData.ratioX]
    let data1 = [...trendOfOvertimeChartData.data1]

    renderChart({ nameData1, lineChart, ratioX, data1 })
  }, [
    lineChart,
    trendOfOvertimeChartData,
    employeeDashboardData.trendOfOvertimeChartData.ratioX,
    employeeDashboardData.trendOfOvertimeChartData.data1
  ])

  if (props.nameChart !== state.nameChart || props.nameData1 !== state.nameData1 || props.nameData2 !== state.nameData2) {
    setState((state) => ({
      ...state,
      nameChart: props.nameChart,
      nameData1: props.nameData1
    }))
  }
  /**
   * Function bắt sự kiện thay đổi unit
   * @param {*} value : Array id đơn vị
   */
  const handleSelectOrganizationalUnit = (value) => {
    if (value.length === 0) {
      value = null
    }
    setState({
      ...state,
      organizationalUnits: value
    })
  }

  /**
   * Bắt sự kiện thay đổi ngày bắt đầu
   * @param {*} value : Giá trị ngày bắt đầu
   */
  const handleStartMonthChange = (value) => {
    setState({
      ...state,
      startDate: value
    })
    search_data_props.handleChangeSearchData('startDateTrendOfOvertimeChart', value)
  }

  /**
   * Bắt sự kiện thay đổi ngày kết thúc
   * @param {*} value : Giá trị ngày kết thúc
   */
  const handleEndMonthChange = (value) => {
    setState({
      ...state,
      endDate: value
    })
    search_data_props.handleChangeSearchData('endDateTrendOfOvertimeChart', value)
  }

  /**
   * Bắt sự kiện thay đổi chế đọ xem biểu đồ
   * @param {*} value : chế độ xem biểu đồ (true or false)
   */
  const handleChangeViewChart = (value) => {
    setState({
      ...state,
      lineChart: value
    })
  }

  /** Xóa các chart đã render khi chưa đủ dữ liệu */
  const removePreviousChart = () => {
    const chart = barChart.current
    if (chart) {
      while (chart && chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  /**
   * Render chart
   * @param {*} data : Dữ liệu biểu đồ
   */
  function renderChart(data) {
    data.data1.shift()
    removePreviousChart()
    let chart = c3.generate({
      bindto: barChart.current,
      data: {
        x: 'x',
        columns: [data.ratioX, ['data1', ...data.data1]],
        type: data.lineChart === true ? '' : 'bar',
        labels: data.lineChart === true ? false : true,
        names: {
          data1: data.nameData1
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%m - %Y',
            outer: false,
            rotate: -45,
            multiline: false
          }
        },
        y: {
          tick: { outer: false }
        }
      }
    })
  }

  /** Bắt sự kiện tìm kiếm */
  const handleSunmitSearch = async () => {
    const { organizationalUnits, startDate, endDate } = state
    await setState({
      ...state,
      startDateShow: startDate,
      endDateShow: endDate,
      organizationalUnitsSearch: organizationalUnits
    })

    if (new Date(formatNewDate(startDate)).getTime() < new Date(formatNewDate(endDate)).getTime()) {
      props.getEmployeeDashboardData({
        searchChart: {
          trendOfOvertimeChart: {
            organizationalUnits: props.organizationalUnits,
            startDate: formatNewDate(startDate),
            endDate: formatNewDate(endDate)
          }
        }
      })
    }
  }

  const showDetailTrendOfOverTimeCharts = () => {
    Swal.fire({
      icon: 'question',
      html: `<h4><div>Biểu đồ xu hướng tăng ca được lấy dữ liệu tăng ca của nhân viên dựa theo chấm công</div> </h4>`,
      width: '50%'
    })
  }

  return (
    <React.Fragment>
      <div className='box box-solid'>
        <div className='box-header with-border'>
          <div className='box-title' style={{ marginRight: '5px' }}>
            {`${nameChart} `}
            {unitName && unitName.length < 2 ? (
              <>
                <span>{` ${unitName?.[0] ? unitName?.[0] : ''} `}</span>
              </>
            ) : (
              <span onClick={() => showListInSwal(unitName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitName?.length}</a>
                <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
              </span>
            )}
            {` ${startDateShow}`}
            <i className='fa fa-fw fa-caret-right'></i>
            {endDateShow}
          </div>
          <a title={'Giải thích'} onClick={showDetailTrendOfOverTimeCharts}>
            <i className='fa fa-question-circle' style={{ cursor: 'pointer' }} />
          </a>
        </div>
        <div className='box-body'>
          <div className='qlcv' style={{ marginBottom: 15 }}>
            <div className='form-inline'>
              <div className='form-group'>
                <label className='form-control-static'>Từ tháng</label>
                <DatePicker
                  id='form-month-overtime'
                  dateFormat='month-year'
                  deleteValue={false}
                  value={startDate}
                  onChange={handleStartMonthChange}
                />
              </div>
              <div className='form-group'>
                <label className='form-control-static'>Đến tháng</label>
                <DatePicker
                  id='to-month-overtime'
                  dateFormat='month-year'
                  deleteValue={false}
                  value={endDate}
                  onChange={handleEndMonthChange}
                />
              </div>
            </div>
            <div className='form-inline'>
              {!props.defaultUnit && (
                <div className='form-group'>
                  <label className='form-control-static'>{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                  <SelectMulti
                    id='multiSelectUnitsOvertime'
                    items={childOrganizationalUnit.map((p, i) => {
                      return { value: p.id, text: p.name }
                    })}
                    options={{
                      nonSelectedText: translate('page.non_unit'),
                      allSelectedText: translate('page.all_unit')
                    }}
                    onChange={handleSelectOrganizationalUnit}
                    value={organizationalUnits}
                  ></SelectMulti>
                </div>
              )}
              <div className='form-group'>
                <label></label>
                <button type='button' className='btn btn-success' title={translate('general.search')} onClick={() => handleSunmitSearch()}>
                  {translate('general.search')}
                </button>
              </div>
            </div>
          </div>
          {employeeDashboardData.isLoading ? (
            <div>{translate('general.loading')}</div>
          ) : employeeDashboardData.trendOfOvertimeChartData?.ratioX?.length > 0 ? (
            <div className='dashboard_box_body'>
              <p className='pull-left' style={{ marginBottom: 0 }}>
                <b>ĐV tính: Số giờ</b>
              </p>
              <div className='box-tools pull-right'>
                <div className='btn-group pull-rigth'>
                  <button
                    type='button'
                    className={`btn btn-xs ${lineChart ? 'active' : 'btn-danger'}`}
                    onClick={() => handleChangeViewChart(false)}
                  >
                    Dạng cột
                  </button>
                  <button
                    type='button'
                    className={`btn btn-xs ${lineChart ? 'btn-danger' : 'active'}`}
                    onClick={() => handleChangeViewChart(true)}
                  >
                    Dạng đường
                  </button>
                </div>
              </div>
              <div ref={barChart}></div>
            </div>
          ) : (
            <div>{translate('kpi.organizational_unit.dashboard.no_data')}</div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { employeeDashboardData } = state
  return { employeeDashboardData }
}

const actionCreators = {
  getEmployeeDashboardData: getEmployeeDashboardActions.getEmployeeDashboardData
}

const trendOfOvertime = connect(mapState, actionCreators)(withTranslate(TrendOfOvertime))
export { trendOfOvertime as TrendOfOvertime }
