import React, { Component, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import { createUnitKpiActions } from '../../kpi/organizational-unit/creation/redux/actions'

import { DatePicker, CustomLegendC3js } from '../../../common-components'

import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'

import c3 from 'c3'
import 'c3/c3.css'
import dayjs from 'dayjs'
import { compactString } from '../../../helpers/stringMethod'
import { showListInSwal } from '../../../helpers/showListInSwal'

const formatString = (String) => {
  let part = String.split('-')
  return [part[1], part[0]].join('-')
}

let INFO_SEARCH = {
  startDate: dayjs().subtract(7, 'month').format('MM-YYYY'),
  endDate: dayjs().format('MM-YYYY')
}

function ResultsOfAllOrganizationalUnitKpiChart(props) {
  const refMultiLineChart = React.createRef()
  const chart = useRef()

  const KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3 }
  const singleUnit = props?.childOrganizationalUnit?.length < 2 ? true : false

  const [state, setState] = useState({
    userRoleId: localStorage.getItem('currentRole'),
    startDate: INFO_SEARCH.startDate,
    endDate: INFO_SEARCH.endDate,
    kindOfPoint: KIND_OF_POINT.AUTOMATIC,
    searchAdvanceMode: false
  })
  const [advancedMode, setAdvancedMode] = useState(false)
  const [date, setDate] = useState(() => {
    const startDate = dayjs().subtract(7, 'month').format('MM-YYYY')
    const endDate = dayjs().format('MM-YYYY')
    return { startDate, endDate }
  })

  const { createKpiUnit, translate } = props
  const { kindOfPoint, infoSearch, searchAdvanceMode } = state

  useEffect(() => {
    const { monthSearch } = props
    const { startDate, endDate } = date

    if (singleUnit) {
      props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(state.userRoleId, formatString(startDate), formatString(endDate))
    } else {
      props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(state.userRoleId, monthSearch, monthSearch)
    }
  }, [JSON.stringify(props?.childOrganizationalUnit), props.monthSearch]) // startDate, endDate

  useEffect(() => {
    const { startDate, endDate } = INFO_SEARCH
    const { childOrganizationalUnit } = props

    //xuất báo cáo
    if (createKpiUnit.organizationalUnitKpiSetsOfChildUnit) {
      const organizationalUnitKpiSetsOfChildUnit = createKpiUnit.organizationalUnitKpiSetsOfChildUnit
      const exportData = convertDataToExportData(organizationalUnitKpiSetsOfChildUnit, startDate, endDate)
      handleExportData(exportData)
    }

    if (createKpiUnit?.organizationalUnitKpiSetsOfChildUnit?.length > 0 && !createKpiUnit.loading && childOrganizationalUnit?.length) {
      // Nếu chọn 1 đơn vị
      if (singleUnit) {
        let category = [],
          dataChart = []

        const period = dayjs(formatString(endDate)).diff(formatString(startDate), 'month')
        for (let i = 0; i <= period; i++) {
          category = [
            ...category,
            dayjs(formatString(startDate)).add(i, 'month').format('YYYY-MM-DD') // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
          ]
        }

        category.unshift('x')
        dataChart = [category]

        let result = [childOrganizationalUnit[0].name]
        const organizationalUnitKpiSetsOfChildUnitLength = createKpiUnit?.organizationalUnitKpiSetsOfChildUnit.length

        for (let x = 0; x < organizationalUnitKpiSetsOfChildUnitLength; x++) {
          if (childOrganizationalUnit[0].name === createKpiUnit.organizationalUnitKpiSetsOfChildUnit[x][0].name) {
            let xLength = createKpiUnit.organizationalUnitKpiSetsOfChildUnit[x].length
            for (let index = 1; index < category.length; index++) {
              let point = 0
              for (let y = 1; y < xLength; y++) {
                let item = createKpiUnit.organizationalUnitKpiSetsOfChildUnit[x]

                if (item[y]?.date && dayjs(item[y].date).format('MM-YYYY') === dayjs(category[index]).format('MM-YYYY')) {
                  if (kindOfPoint === 1) {
                    point = item[y].automaticPoint
                  }

                  if (kindOfPoint === 2) {
                    point = item[y].employeePoint
                  }

                  if (kindOfPoint === 3) point = item[y].approvedPoint
                }
              }
              result = [...result, point]
            }
          }
        }
        dataChart = [...dataChart, result]

        setState({
          ...state,
          dataChart
        })
      } else {
        // Chế độ multUnit và !advancedMode: ko ở chế độ nâng cao,
        // (advancedMode && !searchAdvanceMode): ở chế độ nang cao nhưng chưa bấm tìm kiếm từ tháng tới tháng, mà bấm phân trang, thì sẽ xử lý ở đây
        if (!advancedMode || (advancedMode && !searchAdvanceMode)) {
          let categories = ['x'],
            fullnameUnit = [],
            dataChart = [kindOfPoint === 1 ? 'Điểm tự động' : kindOfPoint === 2 ? 'Điểm tự đánh giá' : 'Điểm người phê duyệt']

          childOrganizationalUnit.forEach((o) => {
            categories = [...categories, compactString(o.name, 10)]
            fullnameUnit = [...fullnameUnit, o.name]
          })

          createKpiUnit.organizationalUnitKpiSetsOfChildUnit.forEach((o, index) => {
            if (kindOfPoint === 1) {
              if (o.length > 1) {
                for (let i = 1; i < o.length; i++) {
                  if (fullnameUnit.includes(o[0]?.name)) dataChart = [...dataChart, o[i]?.automaticPoint]
                }
              } else {
                if (fullnameUnit.includes(o[0]?.name)) dataChart = [...dataChart, null]
              }
            }

            if (kindOfPoint === 2) {
              if (o.length > 1) {
                for (let i = 1; i < o.length; i++) {
                  if (fullnameUnit.includes(o[0]?.name)) dataChart = [...dataChart, o[i]?.employeePoint]
                }
              } else {
                if (fullnameUnit.includes(o[0]?.name)) dataChart = [...dataChart, null]
              }
            }

            if (kindOfPoint === 3) {
              if (o.length > 1) {
                for (let i = 1; i < o.length; i++) {
                  if (fullnameUnit.includes(o[0]?.name)) dataChart = [...dataChart, o[i]?.approvedPoint]
                }
              } else {
                if (fullnameUnit.includes(o[0]?.name)) dataChart = [...dataChart, null]
              }
            }
          })

          if (dataChart?.length && categories?.length)
            setState({
              ...state,
              fullnameUnit,
              dataChart: [categories, dataChart]
            })
        }

        if (advancedMode) {
          // khi ở chế độ nâng cao
          if (searchAdvanceMode) {
            // khi bấm tìm kiếm từ tháng đến tháng ở chế độ nâng cao
            let category = [],
              dataChart = []

            const period = dayjs(formatString(endDate)).diff(formatString(startDate), 'month')
            for (let i = 0; i <= period; i++) {
              category = [
                ...category,
                dayjs(formatString(startDate)).add(i, 'month').format('YYYY-MM-DD') // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
              ]
            }

            category.unshift('x')
            dataChart = [category]

            childOrganizationalUnit.forEach((o) => {
              let pointOfUnit = [o.name]
              const organizationalUnitKpiSetsOfChildUnitLength = createKpiUnit?.organizationalUnitKpiSetsOfChildUnit.length

              for (let x = 0; x < organizationalUnitKpiSetsOfChildUnitLength; x++) {
                if (o.name === createKpiUnit.organizationalUnitKpiSetsOfChildUnit[x][0].name) {
                  let xLength = createKpiUnit.organizationalUnitKpiSetsOfChildUnit[x].length
                  for (let index = 1; index < category.length; index++) {
                    let point = null
                    for (let y = 1; y < xLength; y++) {
                      let item = createKpiUnit.organizationalUnitKpiSetsOfChildUnit[x]

                      if (item[y]?.date && dayjs(item[y].date).format('MM-YYYY') === dayjs(category[index]).format('MM-YYYY')) {
                        if (kindOfPoint === 1) {
                          point = item[y].automaticPoint
                        }

                        if (kindOfPoint === 2) {
                          point = item[y].employeePoint
                        }

                        if (kindOfPoint === 3) point = item[y].approvedPoint
                      }
                    }
                    pointOfUnit = [...pointOfUnit, point]
                  }
                }
              }
              dataChart = [...dataChart, pointOfUnit]
            })

            setState({
              ...state,
              dataChart
            })
          }
        }
      }
    }
  }, [JSON.stringify(props?.createKpiUnit?.organizationalUnitKpiSetsOfChildUnit), kindOfPoint])

  useEffect(() => {
    const { dataChart } = state
    if (dataChart?.length) {
      multiLineChart()
    }
  }, [state.dataChart])

  const handleSelectKindOfPoint = (value) => {
    setState({
      ...state,
      kindOfPoint: Number(value)
    })
  }

  const handleSelectMonthStart = (value) => {
    INFO_SEARCH = {
      ...INFO_SEARCH,
      startDate: value
    }
  }

  const handleSelectMonthEnd = (value) => {
    INFO_SEARCH = {
      ...INFO_SEARCH,
      endDate: value
    }
  }

  const handleSearchData = async () => {
    const { startDate, endDate } = INFO_SEARCH

    let startDateConvert = new Date(formatString(startDate))
    let endDateConvert = new Date(formatString(endDate))
    const { translate } = props

    if (startDateConvert && endDateConvert && startDateConvert.getTime() > endDateConvert.getTime()) {
      Swal.fire({
        title: translate('kpi.organizational_unit.dashboard.alert_search.search'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.dashboard.alert_search.confirm')
      })
    } else {
      props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(state.userRoleId, formatString(startDate), formatString(endDate))
      if (advancedMode && !searchAdvanceMode) {
        setState({
          ...state,
          searchAdvanceMode: true
        })
      } else {
        setDate({
          startDate: startDate,
          endDate: endDate
        })
      }
    }
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
    const { dataChart, fullnameUnit } = state
    removePreviosChart()
    chart.current = c3.generate({
      bindto: refMultiLineChart.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      data: {
        x: 'x',
        columns: dataChart,
        type: 'line',
        labels: true
      },
      bar: {
        width: {
          ratio: 0.3
        }
      },

      axis: {
        x: {
          type: singleUnit ? 'timeseries' : advancedMode && searchAdvanceMode ? 'timeseries' : 'categories',
          tick: {
            format: '%m - %Y',
            outer: false,
            multiline: false
          }
        },
        y: {
          tick: {
            outer: false
          }
        }
      },
      zoom: {
        enabled: true
      },
      tooltip: {
        format: !singleUnit &&
          !advancedMode && {
            title: function (d, index) {
              return fullnameUnit[index]
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

  let organizationalUnitKpiSetsOfChildUnit
  if (createKpiUnit.organizationalUnitKpiSetsOfChildUnit) {
    organizationalUnitKpiSetsOfChildUnit = createKpiUnit.organizationalUnitKpiSetsOfChildUnit
  }

  const handleToggleAdvanceMode = () => {
    const { searchAdvanceMode } = state
    const { monthSearch } = props
    if (!advancedMode) {
      setAdvancedMode(!advancedMode)
      setDate({
        startDate: formatString(monthSearch),
        endDate: formatString(monthSearch)
      })
      INFO_SEARCH = {
        startDate: formatString(monthSearch),
        endDate: formatString(monthSearch)
      }
    } else {
      if (searchAdvanceMode) {
        // tắt advance mode thì quay về mặc định chế dộ multi unit. nếu đã bấm search ở chế dộ multi thì truy vấn dữ liệu cũ
        props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(state.userRoleId, props?.monthSearch, props?.monthSearch)

        setState({
          ...state,
          searchAdvanceMode: false
        })
        setAdvancedMode(!advancedMode)
      } else {
        // nếu chưa bấm tìm kiếm truy vấn ở chế độ advancedMode thì chỉ cần ẩn hiện box search
        setAdvancedMode(!advancedMode)
      }
    }
  }

  const { childOrganizationalUnit } = props

  return (
    <div className='box box-solid'>
      <div className='box-header with-border'>
        <div className='box-title'>
          {translate('kpi.organizational_unit.dashboard.result_kpi_unit')}
          {singleUnit ? (
            <>
              <span>{` ${childOrganizationalUnit?.[0]?.name ? childOrganizationalUnit?.[0]?.name : ''} `}</span>
              {date?.startDate}
              <i className='fa fa-fw fa-caret-right'></i>
              {date?.endDate}
            </>
          ) : advancedMode && searchAdvanceMode ? (
            <span
              onClick={() =>
                showListInSwal(
                  childOrganizationalUnit.map((item) => item?.name),
                  translate('general.list_unit')
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {childOrganizationalUnit?.length}</a>
              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
              {date?.startDate}
              <i className='fa fa-fw fa-caret-right'></i>
              {date?.endDate}
            </span>
          ) : (
            <span
              onClick={() =>
                showListInSwal(
                  childOrganizationalUnit.map((item) => item?.name),
                  translate('general.list_unit')
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {childOrganizationalUnit?.length}</a>
              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
              <span>{` tháng ${formatString(props?.monthSearch)}`}</span>
            </span>
          )}
        </div>
        {!singleUnit && (
          <a title={advancedMode ? 'Tắt chế độ nâng cao' : 'Bật chế độ nâng cao'}>
            <i className='fa fa-gear' onClick={handleToggleAdvanceMode} style={{ fontSize: 19, float: 'right', cursor: 'pointer' }}></i>
          </a>
        )}
      </div>

      <div className='box-body'>
        {/* Search data trong một khoảng thời gian */}
        {(singleUnit || advancedMode) && (
          <div id='box-search' className='qlcv' style={{ marginBottom: 15 }}>
            <section className='form-inline'>
              <div className='form-group'>
                <label>{translate('kpi.organizational_unit.dashboard.start_date')}</label>
                <DatePicker
                  id='monthStartInResultsOfAllOrganizationalUnitKpiChart'
                  dateFormat='month-year'
                  value={date.startDate}
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
                  value={date.endDate}
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
          </div>
        )}

        {createKpiUnit.loading ? (
          <div>{translate('general.loading')}</div>
        ) : state?.dataChart?.length ? (
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
                title={props?.childOrganizationalUnit && `${translate('general.list_unit')} (${props?.childOrganizationalUnit?.length})`}
                dataChartLegend={props?.childOrganizationalUnit?.length && props.childOrganizationalUnit.map((item) => item.name)}
              />
            </section>
          </section>
        ) : (
          <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
        )}
      </div>
    </div>
  )
}

function mapState(state) {
  const { createKpiUnit } = state
  return { createKpiUnit }
}

const actions = {
  getAllOrganizationalUnitKpiSetByTimeOfChildUnit: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTimeOfChildUnit
}

const connectedResultsOfAllOrganizationalUnitKpiChart = React.memo(
  connect(mapState, actions)(withTranslate(ResultsOfAllOrganizationalUnitKpiChart))
)
export { connectedResultsOfAllOrganizationalUnitKpiChart as ResultsOfAllOrganizationalUnitKpiChart }
