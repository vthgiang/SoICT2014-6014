import React, { Component, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import { createUnitKpiActions } from '../../creation/redux/actions'

import { DatePicker, CustomLegendC3js } from '../../../../../common-components'

import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'

import c3 from 'c3'
import 'c3/c3.css'

function ResultsOfAllOrganizationalUnitKpiChart(props) {
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth()

  const INFO_SEARCH = {
    startDate: currentYear + '-0' + 1,
    endDate: currentMonth >= 9 ? currentYear + '-' + (currentMonth + 1) : currentYear + '-0' + (currentMonth + 1)
  }

  const refMultiLineChart = React.createRef()
  const chart = useRef()

  const KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3 }

  const [state, setState] = useState({
    userRoleId: localStorage.getItem('currentRole'),
    startDate: INFO_SEARCH.startDate,
    endDate: INFO_SEARCH.endDate,
    infoSearch: {
      startDate: INFO_SEARCH.startDate,
      endDate: INFO_SEARCH.endDate
    },
    kindOfPoint: KIND_OF_POINT.AUTOMATIC
  })

  const { createKpiUnit, translate } = props
  const { kindOfPoint, infoSearch } = state
  let organizationalUnitKpiSetsOfChildUnit

  useEffect(() => {
    props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(state.userRoleId, state.startDate, state.endDate)
  }, [])

  useEffect(() => {
    props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(state.userRoleId, state.startDate, state.endDate)
  }, [state.startDate, state.endDate])

  useEffect(() => {
    setState({
      ...state,
      kindOfPoint: state.kindOfPoint
    })
    multiLineChart()
  }, [state.kindOfPoint])

  useEffect(() => {
    multiLineChart()
  }, [JSON.stringify(props)])

  const handleSelectKindOfPoint = (value) => {
    setState({
      ...state,
      kindOfPoint: Number(value)
    })
  }

  const handleSelectMonthStart = (value) => {
    let month = value.slice(3, 7) + '-' + value.slice(0, 2)

    setState({
      ...state,
      infoSearch: {
        ...state.infoSearch,
        startDate: month
      }
    })
  }

  const handleSelectMonthEnd = async (value) => {
    let month = value.slice(3, 7) + '-' + value.slice(0, 2)

    setState({
      ...state,
      infoSearch: {
        ...state.infoSearch,
        endDate: month
      }
    })
  }

  const handleSearchData = async () => {
    let startDate = new Date(infoSearch?.startDate)
    let endDate = new Date(infoSearch?.endDate)
    const { translate } = props
    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      Swal.fire({
        title: translate('kpi.organizational_unit.dashboard.alert_search.search'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.dashboard.alert_search.confirm')
      })
    } else {
      await setState({
        ...state,
        startDate: infoSearch?.startDate,
        endDate: infoSearch?.endDate
      })
    }
  }

  const filterAndSetDataPoint = (arrayPoint) => {
    let dateAxisX = [],
      point = []

    dateAxisX.push('date-' + arrayPoint[0].name)
    point.push(arrayPoint[0].name)

    for (let i = 1; i < arrayPoint.length; i++) {
      let newDate = new Date(arrayPoint[i].date)
      newDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + '01'

      dateAxisX.push(newDate)

      if (state.kindOfPoint === KIND_OF_POINT.AUTOMATIC) {
        point.push(arrayPoint[i].automaticPoint)
      } else if (state.kindOfPoint === KIND_OF_POINT.EMPLOYEE) {
        point.push(arrayPoint[i].employeePoint)
      } else if (state.kindOfPoint === KIND_OF_POINT.APPROVED) {
        point.push(arrayPoint[i].approvedPoint)
      }
    }

    return [dateAxisX, point]
  }

  const setDataMultiLineChart = () => {
    const { createKpiUnit } = props
    const { startDate, endDate } = state
    let organizationalUnitKpiSetsOfChildUnit,
      point = [],
      exportData

    if (createKpiUnit.organizationalUnitKpiSetsOfChildUnit) {
      organizationalUnitKpiSetsOfChildUnit = createKpiUnit.organizationalUnitKpiSetsOfChildUnit
      exportData = convertDataToExportData(organizationalUnitKpiSetsOfChildUnit, startDate, endDate)
      handleExportData(exportData)
    }

    if (organizationalUnitKpiSetsOfChildUnit) {
      for (let i = 0; i < organizationalUnitKpiSetsOfChildUnit.length; i++) {
        point = point.concat(filterAndSetDataPoint(organizationalUnitKpiSetsOfChildUnit[i]))
      }
    }

    return point
  }

  const removePreviosChart = () => {
    const chart = refMultiLineChart.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const multiLineChart = () => {
    const { translate } = props
    removePreviosChart()

    let xs = {}
    let dataChart = setDataMultiLineChart()
    if (props.getOrganizationalUnit) {
      props.getOrganizationalUnit(dataChart.filter((item, index) => index % 2 === 1).map((item) => item?.[0]))
    }

    for (let i = 0; i < dataChart.length; i = i + 2) {
      let temporary = {}
      temporary[dataChart[i + 1][0]] = dataChart[i][0]
      xs = Object.assign(xs, temporary)
    }

    chart.current = c3.generate({
      bindto: refMultiLineChart.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      data: {
        xs: xs,
        columns: dataChart
      },

      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: function (x) {
              return x.getMonth() + 1 + '-' + x.getFullYear()
            }
          }
        },
        y: {
          max: 100,
          min: 0,
          label: {
            text: translate('kpi.organizational_unit.dashboard.point'),
            position: 'outer-right'
          },
          padding: {
            top: 10,
            bottom: 10
          }
        }
      },

      legend: {
        show: false
      }
    })
  }

  const handleExportData = (exportData) => {
    const { onDataAvailable } = props
    if (onDataAvailable) {
      onDataAvailable(exportData)
    }
  }

  /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
  const convertDataToExportData = (data, startDate, endDate) => {
    let fileName = 'Kết quả KPI các đơn vị từ ' + (startDate ? startDate : '') + ' đến ' + (endDate ? endDate : '')
    let unitKpiArray = []
    let convertedData = {},
      finalData
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].length > 1) {
          for (let j = 1; j < data[i].length; j++) {
            data[i][j]['unitName'] = data[i][0].name
            unitKpiArray.push(data[i][j])
          }
        }
      }
    }
    if (unitKpiArray.length > 0) {
      unitKpiArray = unitKpiArray.map((x, index) => {
        let automaticPoint = x.automaticPoint === null ? 'Chưa đánh giá' : parseInt(x.automaticPoint)
        let employeePoint = x.employeePoint === null ? 'Chưa đánh giá' : parseInt(x.employeePoint)
        let approverPoint = x.approvedPoint === null ? 'Chưa đánh giá' : parseInt(x.approvedPoint)
        let date = new Date(x.date)
        let time = date.getMonth() + 1 + '-' + date.getFullYear()
        let unitName = x.unitName
        return {
          automaticPoint: automaticPoint,
          employeePoint: employeePoint,
          approverPoint: approverPoint,
          date: date,
          unitName: unitName,
          time: time
        }
      })
    }
    for (let i = 0; i < unitKpiArray.length; i++) {
      let objectName = unitKpiArray[i].time
      let checkDuplicate = Object.keys(convertedData).find((element) => element === objectName)
      if (!checkDuplicate) {
        convertedData[objectName] = []
        convertedData[objectName].push(unitKpiArray[i])
      } else {
        convertedData[objectName].push(unitKpiArray[i])
      }
    }
    finalData = Object.values(convertedData)

    let exportData = {
      fileName: fileName,
      dataSheets: finalData.map((x, index) => {
        return {
          sheetName: x[0].time ? x[0].time : 'sheet ' + index,
          sheetTitle: 'Kết quả KPI các đơn vị ' + (x[0].time ? x[0].time : ''),
          tables: [
            {
              columns: [
                { key: 'unitName', value: 'Tên đơn vị' },
                { key: 'date', value: 'Thời gian' },
                { key: 'automaticPoint', value: 'Điểm KPI tự động' },
                { key: 'employeePoint', value: 'Điểm KPI tự đánh giá' },
                { key: 'approverPoint', value: 'Điểm KPI được phê duyệt' }
              ],
              data: x
            }
          ]
        }
      })
    }
    return exportData
  }

  if (createKpiUnit.organizationalUnitKpiSetsOfChildUnit) {
    organizationalUnitKpiSetsOfChildUnit = createKpiUnit.organizationalUnitKpiSetsOfChildUnit
  }

  let d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day
  let defaultEndDate = [month, year].join('-')
  let defaultStartDate = ['01', year].join('-')

  return (
    <React.Fragment>
      {/* Search data trong một khoảng thời gian */}
      <section className='form-inline'>
        <div className='form-group'>
          <label>{translate('kpi.organizational_unit.dashboard.start_date')}</label>
          <DatePicker
            id='monthStartInResultsOfAllOrganizationalUnitKpiChart'
            dateFormat='month-year'
            value={defaultStartDate}
            onChange={handleSelectMonthStart}
            disabled={false}
          />
        </div>
      </section>
      <section className='form-inline'>
        <div className='form-group'>
          <label>{translate('kpi.organizational_unit.dashboard.end_date')}</label>
          <DatePicker
            id='monthEndInResultsOfAllOrganizationalUnitKpiChart'
            dateFormat='month-year'
            value={defaultEndDate}
            onChange={handleSelectMonthEnd}
            disabled={false}
          />
        </div>
        <div className='form-group'>
          <button type='button' className='btn btn-success' onClick={handleSearchData}>
            {translate('kpi.organizational_unit.dashboard.search')}
          </button>
        </div>
      </section>
      {createKpiUnit.loading ? (
        <div>{translate('general.loading')}</div>
      ) : organizationalUnitKpiSetsOfChildUnit ? (
        <section>
          <section className='box-body' style={{ textAlign: 'right' }}>
            <div className='btn-group'>
              <button
                type='button'
                className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`}
                onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.AUTOMATIC)}
              >
                {translate('kpi.evaluation.dashboard.auto_point')}
              </button>
              <button
                type='button'
                className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`}
                onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.EMPLOYEE)}
              >
                {translate('kpi.evaluation.dashboard.employee_point')}
              </button>
              <button
                type='button'
                className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`}
                onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.APPROVED)}
              >
                {translate('kpi.evaluation.dashboard.approve_point')}
              </button>
            </div>
          </section>
          <section id={'resultsOfAllUnit'} className='c3-chart-container'>
            <div ref={refMultiLineChart}></div>
            <CustomLegendC3js
              chart={chart.current}
              chartId={'resultsOfAllUnit'}
              legendId={'resultsOfAllUnitLegend'}
              title={
                organizationalUnitKpiSetsOfChildUnit && `${translate('general.list_unit')} (${organizationalUnitKpiSetsOfChildUnit.length})`
              }
              dataChartLegend={organizationalUnitKpiSetsOfChildUnit && organizationalUnitKpiSetsOfChildUnit.map((item) => item[0].name)}
            />
          </section>
        </section>
      ) : (
        organizationalUnitKpiSetsOfChildUnit && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
      )}
    </React.Fragment>
  )
}

function mapState(state) {
  const { createKpiUnit } = state
  return { createKpiUnit }
}

const actions = {
  getAllOrganizationalUnitKpiSetByTimeOfChildUnit: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTimeOfChildUnit
}

const connectedResultsOfAllOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(ResultsOfAllOrganizationalUnitKpiChart))
export { connectedResultsOfAllOrganizationalUnitKpiChart as ResultsOfAllOrganizationalUnitKpiChart }
