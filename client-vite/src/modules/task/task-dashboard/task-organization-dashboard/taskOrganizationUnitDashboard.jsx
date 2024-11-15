import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import isEqual from 'lodash/isEqual'
import dayjs from 'dayjs'
import { taskManagementActions } from '../../task-management/redux/actions'
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../kpi/evaluation/dashboard/redux/actions'
import { DistributionOfEmployee } from './distributionOfEmployee'
import { DomainOfTaskResultsChart } from '../task-personal-dashboard/domainOfTaskResultsChart'
import { TaskStatusChart } from '../task-personal-dashboard/taskStatusChart'
import { LoadTaskOrganizationChart } from './loadTaskOrganizationChart'
import { AverageResultsOfTaskInOrganizationalUnit } from './averageResultsOfTaskInOrganizationalUnit'
import { AllTimeSheetLogsByUnit } from './allTimeSheetLogByUnit'
import { InprocessOfUnitTask } from './processOfUnitTasks'
import { GanttCalendar } from '../task-personal-dashboard/ganttCalendar'
import GeneralTaskChart from './generalTaskChart'
import { CurrentTaskTimesheetLogInOrganizationalUnit } from './currentTaskTimesheetLogInOrganizationalUnit'
import { SelectMulti, DatePicker, LazyLoadComponent, forceCheckOrVisible, ExportExcel } from '../../../../common-components/index'
import { showListInSwal } from '../../../../helpers/showListInSwal'
import EmployeeProcessTask from '../task-personal-dashboard/employeeProcessTask'

const formatString = (value) => {
  if (value && typeof value === 'string') {
    const part = value.split('-')
    return [part[1], part[0]].join('-')
  }
  return value
}
const CRITERIA = { NOT_COEFFICIENT: 0, COEFFICIENT: 1 }
const TYPEPOINT = { AUTOMATIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 }

// giá trị tìm kiếm mặc định mỗi khi search
const DEFAULT_SEARCH = {
  'general-task-chart': {},
  'gantt-chart': {
    status: ['inprocess']
  },
  'employee-distribution-chart': {
    status: ['inprocess', 'wait_for_approval', 'finished', 'delayed', 'canceled']
  },
  'in-process-unit-chart': {},
  'task-results-domain-chart': {
    typePoint: TYPEPOINT.AUTOMATIC_POINT
  },
  'task-status-chart': {},
  'average-results-chart': {
    typePoint: TYPEPOINT.AUTOMATIC_POINT,
    criteria: CRITERIA.NOT_COEFFICIENT
  },
  'load-task-organization-chart': {},
  'all-time-sheet-log-by-unit': {}
}

// let dataSearch = DEFAULT_SEARCH
let INFO_SEARCH = {
  // bộ lọc tìm kiếm
  unitsSelected: null,
  startMonth: dayjs().subtract(3, 'month').format('YYYY-MM'),
  endMonth: dayjs().format('YYYY-MM')
}

function TaskOrganizationUnitDashboard(props) {
  const { taskDashboardCharts } = props.tasks
  const { translate, dashboardEvaluationEmployeeKpiSet } = props
  const [state, setState] = useState(() => {
    return {
      unitsSelected: [],
      startMonth: INFO_SEARCH.startMonth,
      startMonthTitle: formatString(INFO_SEARCH.startMonth),
      endMonth: INFO_SEARCH.endMonth,
      endMonthTitle: formatString(INFO_SEARCH.endMonth)
    }
  })

  const { unitsSelected, startMonthTitle, endMonthTitle, selectBoxUnit, dataExport, dataTimeSheetsExport } = state

  // tham số các chart để search khi params ở component con thay đổi
  const dataSearch = useRef(DEFAULT_SEARCH)
  const handleChangeDataSearch = (name, value) => {
    dataSearch.current = {
      ...dataSearch.current,
      [name]: value
    }
  }

  useEffect(() => {
    props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem('currentRole'))
  }, [])

  useEffect(() => {
    // Trưởng hợp đổi 2 role cùng là trưởng đơn vị, cập nhật lại select box chọn đơn vị
    if (unitsSelected && dashboardEvaluationEmployeeKpiSet && !dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
      setState({
        ...state,
        unitsSelected: null
      })
    }

    if (!unitsSelected && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
      const childrenOrganizationalUnit = []
      const queue = []
      let currentOrganizationalUnit
      if (dashboardEvaluationEmployeeKpiSet) {
        currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit
      }
      if (currentOrganizationalUnit) {
        childrenOrganizationalUnit.push(currentOrganizationalUnit)
        queue.push(currentOrganizationalUnit)
        while (queue.length > 0) {
          const v = queue.shift()
          if (v.children) {
            for (let i = 0; i < v.children.length; i++) {
              const u = v.children[i]
              queue.push(u)
              childrenOrganizationalUnit.push(u)
            }
          }
        }
      }
      let organizationalUnitId = childrenOrganizationalUnit?.[0]?.id
      if (!Array.isArray(organizationalUnitId)) {
        organizationalUnitId = organizationalUnitId.split(' ')
      }
      const data = {
        ...DEFAULT_SEARCH,
        'common-params': {
          organizationalUnitId,
          startMonth: state.startMonth,
          endMonth: state.endMonth
        }
      }
      // service mới, lưu vào state redux : props.tasks.taskDashboardCharts:[ general-task-chart, ]
      props.getOrganizationTaskDashboardChart(data)
      INFO_SEARCH = {
        ...INFO_SEARCH,
        unitsSelected: [childrenOrganizationalUnit?.[0]?.id].length ? [childrenOrganizationalUnit?.[0]?.id] : state.unitsSelected
      }
      setState({
        ...state,
        unitsSelected: [childrenOrganizationalUnit?.[0]?.id].length ? [childrenOrganizationalUnit?.[0]?.id] : state.unitsSelected,
        selectBoxUnit: childrenOrganizationalUnit
      })
    }
  }, [JSON.stringify(dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit)])

  const handleChangeOrganizationUnit = (value) => {
    INFO_SEARCH = {
      ...INFO_SEARCH,
      unitsSelected: value
    }
  }

  const handleSelectMonthStart = (value) => {
    INFO_SEARCH = {
      ...INFO_SEARCH,
      startMonth: value ? formatString(value) : value
    }
  }

  const handleSelectMonthEnd = (value) => {
    INFO_SEARCH = {
      ...INFO_SEARCH,
      endMonth: value ? formatString(value) : value
    }
  }

  const handleSearchData = async () => {
    const { startMonth, endMonth, unitsSelected } = INFO_SEARCH

    const startMonthObj = new Date(startMonth)
    const endMonthObj = new Date(endMonth)

    if (startMonthObj.getTime() > endMonthObj.getTime()) {
      const { translate } = props
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else if (unitsSelected.length === 0) {
      Swal.fire({
        title: 'Bạn phải chọn ít nhất 1 đơn vị trước',
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else {
      setState({
        ...state,
        startMonth,
        startMonthTitle: formatString(startMonth),
        endMonth,
        endMonthTitle: formatString(endMonth),
        unitsSelected
      })

      const data = {
        ...dataSearch.current,
        'common-params': {
          organizationalUnitId: unitsSelected,
          startMonth,
          endMonth
        }
      }
      props.getOrganizationTaskDashboardChart(data)
    }
  }

  const getUnitName = (arrayUnit, arrUnitId) => {
    const data = []
    arrayUnit &&
      arrayUnit.forEach((x) => {
        arrUnitId &&
          arrUnitId.length > 0 &&
          arrUnitId.forEach((y) => {
            if (x.id === y) data.push(x.name)
          })
      })
    return data
  }

  const showUnitGeneraTask = (selectBoxUnit, unitsSelected) => {
    const { translate } = props
    if (unitsSelected && unitsSelected.length > 0) {
      const listUnit = getUnitName(selectBoxUnit, unitsSelected)
      showListInSwal(listUnit, translate('general.list_unit'))
    }
  }

  const handleDataExport = (data) => {
    const { dataExport } = state
    if (!isEqual(dataExport, data)) {
      setState({
        ...state,
        dataExport: data
      })
    }
  }

  const handleDataTimeSheetsExport = (data) => {
    const { dataTimeSheetsExport } = state
    if (!isEqual(dataTimeSheetsExport, data)) {
      setState({
        ...state,
        dataTimeSheetsExport: data
      })
    }
  }

  // const handleChangeDataSearch = (name, value) => {
  //     dataSearch = {
  //         ...dataSearch,
  //         [name]: value
  //     }
  // }
  const getDataSearchChart = (data) => {
    const { startMonth, endMonth } = INFO_SEARCH
    const { unitsSelected } = state

    const data1 = {
      ...data,
      'common-params': {
        organizationalUnitId: unitsSelected,
        startMonth,
        endMonth
      }
    }
    props.getOrganizationTaskDashboardChart(data1)
  }

  const isLoading = (chartName) => {
    const x = taskDashboardCharts?.[chartName]?.isLoading
    return x
  }

  let currentOrganizationalUnit
  let currentOrganizationalUnitLoading

  if (dashboardEvaluationEmployeeKpiSet) {
    currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit
    currentOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
  }

  const handleNavTabs = (value) => {
    if (value) {
      forceCheckOrVisible(true, false)
    }
    window.dispatchEvent(new Event('resize')) // Fix lỗi chart bị resize khi đổi tab
  }

  const showTimeSheetDoc = () => {
    Swal.fire({
      icon: 'question',

      html: `<h3 style="color: red"><div>Thống kê bấm giờ đơn vị</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Thống kê bấm giờ của tất cả nhân viên (active) trong các đơn vị được chọn được liệt kê như sau:</p>
            <ul>
                <li>Lấy tất cả các thông tin bấm giờ của mỗi nhân viên trong các đơn vị</li>
                <li>Bao gồm: Tổng thời gian, bấm giờ, bấm hẹn giờ, bấm bù giờ</li>
            </ul>`,
      width: '50%'
    })
  }
  return (
    <>
      {currentOrganizationalUnit ? (
        <div className='qlcv'>
          <div className='form-inline' style={{ marginBottom: 10 }}>
            <div className='form-group'>
              <label style={{ width: 'auto' }} className='form-control-static'>
                {translate('kpi.evaluation.dashboard.organizational_unit')}
              </label>
              {selectBoxUnit && selectBoxUnit.length && (
                <SelectMulti
                  id='multiSelectOrganizationalUnitInTaskUnit'
                  items={selectBoxUnit.map((item) => {
                    return { value: item.id, text: item.name }
                  })}
                  options={{
                    nonSelectedText: translate('task.task_management.select_department'),
                    allSelectedText: translate('kpi.evaluation.dashboard.all_unit')
                  }}
                  onChange={handleChangeOrganizationUnit}
                  value={INFO_SEARCH.unitsSelected ? INFO_SEARCH.unitsSelected : undefined}
                />
              )}
            </div>
            <div className='form-group'>
              <label style={{ width: 'auto' }}>{translate('task.task_management.from')}</label>
              <DatePicker
                id='monthStartInOrganizationUnitDashboard'
                dateFormat='month-year'
                value={startMonthTitle}
                onChange={handleSelectMonthStart}
                disabled={false}
              />
            </div>
            <div className='form-group'>
              <label style={{ width: 'auto' }}>{translate('task.task_management.to')}</label>
              <DatePicker
                id='monthEndInOrganizationUnitDashboard'
                dateFormat='month-year'
                value={endMonthTitle}
                onChange={handleSelectMonthEnd}
                disabled={false}
              />
            </div>

            <div className='form-group'>
              <button className='btn btn-success' onClick={() => handleSearchData()}>
                {translate('task.task_management.search')}
              </button>
            </div>
          </div>

          {/* Tổng quan công việc đơn vị */}
          <div className='nav-tabs-custom'>
            <ul className='nav nav-tabs'>
              <li className='active'>
                <a href='#general' data-toggle='tab' onClick={() => handleNavTabs()}>
                  Tổng quan
                </a>
              </li>
              <li>
                <a href='#calender' data-toggle='tab' onClick={() => handleNavTabs(true)}>
                  {translate('task.task_management.tasks_calendar')}
                </a>
              </li>
            </ul>

            <div className='tab-content '>
              <div className='tab-pane active' id='general'>
                {/* Tổng quan công việc */}
                <div className='row'>
                  <div className='col-xs-12'>
                    <div className='box box-primary'>
                      <div className='box-header with-border'>
                        <div className='box-title'>
                          {unitsSelected && unitsSelected.length < 2 ? (
                            <>
                              <span>{`${translate('task.task_dashboard.general_unit_task')} ${getUnitName(selectBoxUnit, unitsSelected)
                                .map((o) => o)
                                .join(', ')} `}</span>
                              <span>
                                {`${startMonthTitle}`}
                                <i className='fa fa-fw fa-caret-right' />
                                {`${endMonthTitle}`}
                              </span>
                            </>
                          ) : (
                            <span onClick={() => showUnitGeneraTask(selectBoxUnit, unitsSelected)} style={{ cursor: 'pointer' }}>
                              <span>{`${translate('task.task_dashboard.general_unit_task')} `}</span>
                              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}>{unitsSelected && unitsSelected.length}</a>
                              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                              <span>
                                {`${startMonthTitle}`}
                                <i className='fa fa-fw fa-caret-right' />
                                {`${endMonthTitle}`}{' '}
                              </span>
                            </span>
                          )}
                        </div>
                        {dataExport && (
                          <ExportExcel
                            id='export-general-task'
                            buttonName={translate('general.export')}
                            exportData={dataExport}
                            style={{ marginTop: 0 }}
                          />
                        )}
                      </div>

                      <div className='box-body qlcv'>
                        {!isLoading('general-task-chart') ? (
                          <GeneralTaskChart
                            startMonthTitle={startMonthTitle}
                            endMonthTitle={endMonthTitle}
                            unitNameSelected={unitsSelected && getUnitName(selectBoxUnit, unitsSelected)}
                            handleDataExport={handleDataExport}
                          />
                        ) : (
                          <div>{translate('general.loading')}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Đóng góp công việc */}
                <div className='row'>
                  <div className='col-xs-12'>
                    <div className='box box-primary'>
                      <div className='box-header with-border'>
                        <div className='box-title'>
                          {translate('task.task_management.distribution_Of_Employee')}
                          {unitsSelected && unitsSelected.length < 2 ? (
                            <span>{` ${getUnitName(selectBoxUnit, unitsSelected)
                              .map((o) => o)
                              .join(', ')} `}</span>
                          ) : (
                            <span onClick={() => showUnitGeneraTask(selectBoxUnit, unitsSelected)} style={{ cursor: 'pointer' }}>
                              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitsSelected && unitsSelected.length}</a>
                              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                          )}
                          {startMonthTitle}
                          <i className='fa fa-fw fa-caret-right' />
                          {endMonthTitle}
                        </div>
                      </div>
                      <div className='box-body qlcv'>
                        <LazyLoadComponent once>
                          {!isLoading('employee-distribution-chart') ? (
                            <DistributionOfEmployee
                              handleChangeDataSearch={handleChangeDataSearch}
                              getDataSearchChart={getDataSearchChart}
                            />
                          ) : (
                            <div>{translate('general.loading')}</div>
                          )}
                        </LazyLoadComponent>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tiến độ công việc */}
                <div className='row'>
                  <div className='col-xs-12'>
                    <div className='box box-primary'>
                      <div className='box-header with-border'>
                        <div className='box-title'>
                          {translate('task.task_management.calc_progress')}
                          {unitsSelected && unitsSelected.length < 2 ? (
                            <span>{` ${getUnitName(selectBoxUnit, unitsSelected)
                              .map((o) => o)
                              .join(', ')} `}</span>
                          ) : (
                            <span onClick={() => showUnitGeneraTask(selectBoxUnit, unitsSelected)} style={{ cursor: 'pointer' }}>
                              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitsSelected && unitsSelected.length}</a>
                              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                          )}
                          {startMonthTitle}
                          <i className='fa fa-fw fa-caret-right' />
                          {endMonthTitle}
                        </div>
                      </div>
                      <div className='box-body qlcv'>
                        <LazyLoadComponent once>
                          {!isLoading('in-process-unit-chart') ? (
                            <InprocessOfUnitTask
                              unitSelected={unitsSelected}
                              unitNameSelected={unitsSelected && getUnitName(selectBoxUnit, unitsSelected)}
                            />
                          ) : (
                            <div>{translate('general.loading')}</div>
                          )}
                        </LazyLoadComponent>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Miền công việc + trạng thái công việc  */}
                <div className='row'>
                  <div className='col-xs-6'>
                    <div className='box box-primary'>
                      <div className='box-header with-border'>
                        <div className='box-title'>
                          {translate('task.task_management.dashboard_area_result')}
                          {unitsSelected && unitsSelected.length < 2 ? (
                            <span>{` ${getUnitName(selectBoxUnit, unitsSelected)
                              .map((o) => o)
                              .join(', ')} `}</span>
                          ) : (
                            <span onClick={() => showUnitGeneraTask(selectBoxUnit, unitsSelected)} style={{ cursor: 'pointer' }}>
                              <span>{` ${translate('task.task_dashboard.of')}`}</span>
                              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitsSelected && unitsSelected.length}</a>
                              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                          )}
                          {startMonthTitle}
                          <i className='fa fa-fw fa-caret-right' />
                          {endMonthTitle}
                        </div>
                      </div>
                      <div className='box-body qlcv'>
                        <LazyLoadComponent once>
                          {!isLoading('task-results-domain-chart') ? (
                            <DomainOfTaskResultsChart
                              handleChangeDataSearch={handleChangeDataSearch}
                              getDataSearchChart={getDataSearchChart}
                              TaskOrganizationUnitDashboard
                            />
                          ) : (
                            <div>{translate('general.loading')}</div>
                          )}
                        </LazyLoadComponent>
                      </div>
                    </div>
                  </div>
                  <div className='col-xs-6'>
                    <div className='box box-primary'>
                      <div className='box-header with-border'>
                        <div className='box-title'>
                          {translate('task.task_management.detail_status_task')}
                          {unitsSelected && unitsSelected.length < 2 ? (
                            <span>{` ${getUnitName(selectBoxUnit, unitsSelected)
                              .map((o) => o)
                              .join(', ')} `}</span>
                          ) : (
                            <span onClick={() => showUnitGeneraTask(selectBoxUnit, unitsSelected)} style={{ cursor: 'pointer' }}>
                              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitsSelected && unitsSelected.length}</a>
                              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                          )}
                          {startMonthTitle}
                          <i className='fa fa-fw fa-caret-right' />
                          {endMonthTitle}
                        </div>
                      </div>
                      <div className='box-body qlcv' style={{ height: '384px' }}>
                        <LazyLoadComponent once>
                          {!isLoading('task-status-chart') ? (
                            <TaskStatusChart TaskOrganizationUnitDashboard />
                          ) : (
                            <div>{translate('general.loading')}</div>
                          )}
                        </LazyLoadComponent>
                      </div>
                    </div>
                  </div>
                </div>

                {/* kết quả trung bình công việc */}
                <div className='row'>
                  <div className='col-xs-12'>
                    <div className='box box-primary'>
                      <div className='box-header with-border'>
                        <div className='box-title'>
                          {translate('task.task_management.detail_average_results')}
                          {unitsSelected && unitsSelected.length < 2 ? (
                            <span>{` ${getUnitName(selectBoxUnit, unitsSelected)
                              .map((o) => o)
                              .join(', ')} `}</span>
                          ) : (
                            <span onClick={() => showUnitGeneraTask(selectBoxUnit, unitsSelected)} style={{ cursor: 'pointer' }}>
                              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitsSelected && unitsSelected.length}</a>
                              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                          )}
                          {startMonthTitle}
                          <i className='fa fa-fw fa-caret-right' />
                          {endMonthTitle}
                        </div>
                      </div>
                      <div className='box-body qlcv'>
                        {/* <LazyLoadComponent once={true}> */}
                        {!isLoading('average-results-chart') ? (
                          <AverageResultsOfTaskInOrganizationalUnit
                            handleChangeDataSearch={handleChangeDataSearch}
                            getDataSearchChart={getDataSearchChart}
                          />
                        ) : (
                          <div className='col-xs-12'>{translate('general.loading')}</div>
                        )}
                        {/* </LazyLoadComponent> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard tải công việc */}
                <div className='row'>
                  <div className='col-xs-12'>
                    {/* // <LazyLoadComponent once={true}> */}
                    {!isLoading('load-task-organization-chart') ? (
                      <LoadTaskOrganizationChart
                        units={selectBoxUnit}
                        idsUnit={unitsSelected}
                        startMonthTitle={startMonthTitle}
                        endMonthTitle={endMonthTitle}
                        getUnitName={getUnitName}
                        showUnitTask={showUnitGeneraTask}
                        typeChart='followTime'
                        chartData={taskDashboardCharts}
                      />
                    ) : (
                      <div>{translate('general.loading')}</div>
                    )}
                    {/* </LazyLoadComponent> */}
                  </div>
                </div>

                {/* Danh sách nhân viên đang bấm giờ */}
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='box box-solid'>
                      <CurrentTaskTimesheetLogInOrganizationalUnit
                        organizationalUnitIds={unitsSelected}
                        listUnitSelect={selectBoxUnit}
                        getUnitName={getUnitName}
                        showUnitTask={showUnitGeneraTask}
                      />
                    </div>
                  </div>
                </div>

                {/* Thống kê bấm giờ */}
                <div className='row'>
                  <div className='col-xs-12 col-md-12'>
                    <div className='box box-primary'>
                      <div className='box-header with-border'>
                        <div className='box-title'>
                          {translate('task.task_dashboard.statistical_timesheet_logs')}
                          {unitsSelected && unitsSelected.length < 2 ? (
                            <span>{` ${getUnitName(selectBoxUnit, unitsSelected)
                              .map((o) => o)
                              .join(', ')} `}</span>
                          ) : (
                            <span onClick={() => showUnitGeneraTask(selectBoxUnit, unitsSelected)} style={{ cursor: 'pointer' }}>
                              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitsSelected && unitsSelected.length}</a>
                              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                          )}
                          {startMonthTitle}
                          <i className='fa fa-fw fa-caret-right' />
                          {endMonthTitle}
                          <a onClick={() => showTimeSheetDoc()}>
                            <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px' }} />
                          </a>
                        </div>
                        <ExportExcel id='export-timesheets-logs' style={{ right: 0 }} exportData={dataTimeSheetsExport} />
                      </div>
                      <div className='box-body qlcv'>
                        {!isLoading('all-time-sheet-logs-by-unit') ? (
                          // <LazyLoadComponent once={true}>
                          <AllTimeSheetLogsByUnit
                            startMonthTitle={startMonthTitle}
                            endMonthTitle={endMonthTitle}
                            unitsSelected={unitsSelected ? getUnitName(selectBoxUnit, unitsSelected) : []}
                            handleDataTimeSheetsExport={handleDataTimeSheetsExport}
                          />
                        ) : (
                          // </LazyLoadComponent>
                          <div>{translate('general.loading')}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab lịch công việc */}
              <div className='tab-pane' id='calender'>
                {/* Biểu đồ gantt */}
                <div className='row'>
                  <div className='col-xs-12'>
                    <div className='box box-primary'>
                      <div className='box-header with-border'>
                        <div className='box-title'>
                          {translate('task.task_management.tasks_calendar')}
                          {unitsSelected && unitsSelected.length < 2 ? (
                            <span>{` ${getUnitName(selectBoxUnit, unitsSelected)
                              .map((o) => o)
                              .join(', ')} `}</span>
                          ) : (
                            <span onClick={() => showUnitGeneraTask(selectBoxUnit, unitsSelected)} style={{ cursor: 'pointer' }}>
                              <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitsSelected && unitsSelected.length}</a>
                              <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                          )}
                          {startMonthTitle}
                          <i className='fa fa-fw fa-caret-right' />
                          {endMonthTitle}
                        </div>
                      </div>
                      {/* <LazyLoadComponent once={true}> */}
                      {!isLoading('gantt-chart') ? (
                        <GanttCalendar handleChangeDataSearch={handleChangeDataSearch} getDataSearchChart={getDataSearchChart} unit />
                      ) : (
                        <div>{translate('general.loading')}</div>
                      )}
                      {/* </LazyLoadComponent> */}
                    </div>
                  </div>
                </div>
              </div>

              <EmployeeProcessTask />
            </div>
          </div>
        </div>
      ) : (
        currentOrganizationalUnitLoading && (
          <div className='box'>
            <div className='box-body'>
              <h4>{translate('general.not_org_unit')}</h4>
            </div>
          </div>
        )
      )}
    </>
  )
}

function mapState(state) {
  const { tasks, user, dashboardEvaluationEmployeeKpiSet } = state
  return { tasks, user, dashboardEvaluationEmployeeKpiSet }
}
const actionCreators = {
  getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
  getOrganizationTaskDashboardChart: taskManagementActions.getOrganizationTaskDashboardChart
}

export default connect(mapState, actionCreators)(withTranslate(TaskOrganizationUnitDashboard))
