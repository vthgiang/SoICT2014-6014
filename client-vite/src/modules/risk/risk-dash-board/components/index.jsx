import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import dayjs from 'dayjs'
import Chart from 'react-google-charts'
import { Line } from 'react-chartjs-2'
import { DatePicker } from '../../../../common-components'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { RoleActions } from '../../../super-admin/role/redux/actions'
import { RiskDistributionActions } from '../redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { riskActions } from '../../risk-list/redux/actions'
// import urgentIcon from './warning.png';
// import todoIcon from './to-do-list.png';
import 'c3/c3.css'
// import RiskMatrix from "./riskMatrix";
import { RiskDetail } from './riskDetail'
import { DateDiff, isBetweenDate, getRankingColors, isIntersection } from '../../riskHelper'
import './riskDashboard.css'
import { getStorage } from '../../../../config'
import { getRiskColor } from '../../process-analysis/TaskPertHelper'

function RiskDashboard(props) {
  const initState = {
    tableId: 'risk-dis-table',
    perPage: 20,
    page: 1,
    lists: [],
    riskList: [], // temp for filter
    curentRowDetail: null,
    todayRisk: [],
    highProbRisk: [],
    highImpactRisk: [],
    urgentRisk: [],
    approvableRisk: [],
    finishedRisk: [],
    inprocessRisk: [],
    user: getStorage('userId'),
    type: 1,
    employees: undefined,
    currentRole: undefined,
    departments: undefined,
    currentDepartment: undefined
  }
  const [state, setState] = useState(initState)
  const { lists } = state
  const [dateTimeInfo, setDateTimeInfo] = useState({
    startMonthTitle: '10-2020',
    endMonthTitle: '07-2021',
    startMonth: '2020-10',
    endMonth: '2021-07'
  })
  const [bayesData, setBayesData] = useState({})
  const { translate, riskDistribution, risk } = props
  const { type } = state
  const { startMonthTitle, endMonthTitle, month, year, startMonth, endMonth } = dateTimeInfo
  useEffect(() => {
    props.getDepartmentOfUser(getStorage('userId'))
    props.show(getStorage('currentRole'))
    props.getAllEmployeeOfUnitByRole(getStorage('currentRole'))
    props.updateProb()
    props.getRiskDistributions()
    props.getRisks()
  }, [])
  useEffect(() => {
    props.show(getStorage('currentRole'))
    props.getAllEmployeeOfUnitByRole(getStorage('currentRole'))
  }, [getStorage('currentRole')])
  useEffect(() => {
    if (props.user.organizationalUnitsOfUser) {
      const data = props.user.organizationalUnitsOfUser
      console.log(data)
      const currentRole = getStorage('currentRole')
      const currentDepartment = data.find(
        (item) => item.employees.includes(currentRole) || item.managers.includes(currentRole) || item.deputyManagers.includes(currentRole)
      )
      // allRoles = allRoles.concat(data.employees).concat(data.managers).concat(data.deputyManagers)
      // console.log(allRoles,getStorage('currentRole'))
      setState({
        ...state,
        departments: data,
        currentDepartment
        // employees:data[0].manager.concat(data[0].employees)
      })
    }
  }, [props.user.organizationalUnitsOfUser, getStorage('currentRole')])
  // useEffect(() => {
  //     if (state.currentDepartment) {
  //         let employees = []
  //         employees = employees.concat(state.currentDepartment.manager)
  //         employees = employees.concat(state.currentDepartment.employees)
  //         employees = employees.concat(getStorage('userId'))
  //         console.log(employees)
  //         setState({
  //             ...state,
  //             employees: employees
  //         })
  //     }
  // }, [state.currentDepartment])
  useEffect(() => {
    if (props.role.item) {
      console.log(props.role)
      setState({
        ...state,
        currentRole: props.role.item
      })
    }
  }, [props.role.item])
  useEffect(() => {
    if (props.user.employees) {
      console.log(props.user.employees)
      setState({
        ...state,
        employees: props.user.employees
      })
    }
  }, [props.user.employees])
  useEffect(() => {
    if (risk.lists.length != 0 && state.employees) {
      let riskList = risk.lists
      if (startMonth.length != 0 && endMonth.length != 0) {
        const start = new Date(`${startMonth}-01`)
        const end = new Date(`${endMonth}-01`)
        end.setMonth(end.getMonth() + 1)
        riskList = lists.filter((risk) => isBetweenDate(risk.occurrenceDate, start, end))
      }
      // console.log(state.employees)
      const employeesOfUnit = [getStorage('userId')].concat(state.employees.map((u) => u.userId._id))
      // console.log(employeesOfUnit)
      const temp = risk.lists.filter(
        (r) =>
          isIntersection(
            r.accountableEmployees.map((u) => u._id),
            employeesOfUnit
          ) &&
          isIntersection(
            r.responsibleEmployees.map((u) => u._id),
            employeesOfUnit
          )
      )
      console.log(temp)
      setState({
        ...state,
        lists: temp,
        riskList: temp
      })
    }
  }, [risk.lists, state.employees, getStorage('currentRole')])
  useEffect(() => {
    setBayesData(riskDistribution.bayesData)
  }, [riskDistribution.bayesData])
  useEffect(() => {
    if (lists) {
      // let lists = props.risk.lists
      // console.log(lists)
      const urgentRisk = lists.filter((r) => r.ranking >= 9 && r.riskStatus != 'finished')
      console.log('urgentRisk', urgentRisk)
      const approvableRisk = lists.filter((r) => r.riskStatus == 'wait_for_approve')
      const finishedRisk = lists.filter((r) => r.riskStatus == 'finished')
      const inprocessRisk = lists.filter((r) => r.riskStatus == 'inprocess')
      const highImpactRisk = lists.filter((r) => {
        const impact = r.impact ? r.impact : null
        // console.log(impact)
        const totalImpact = impact != null ? impact.health + impact.security + impact.enviroment : 0
        return totalImpact > 9
      })
      const highProbRisk = lists.filter((r) => {
        // console.log(riskDistribution.lists)
        const riskDis = riskDistribution.lists.find((rd) => rd.riskID == r.riskID)
        // console.log(riskDis)
        // if(riskDis==undefined )return false
        return riskDis?.prob > 0.5
      })
      const todayRisk = lists.filter((r) => DateDiff.inDays(r.occurrenceDate, new Date()) == 0)
      setState({
        ...state,
        urgentRisk,
        finishedRisk,
        approvableRisk,
        todayRisk,
        inprocessRisk,
        highImpactRisk,
        highProbRisk
      })
    }
  }, [lists])

  const handleSelectMonthStart = (value) => {
    console.log('startMonth', value)
    const month = `${value.slice(3, 7)}-${value.slice(0, 2)}`
    const startMonthTitle = `${value.slice(0, 2)}-${value.slice(3, 7)}`
    setDateTimeInfo({
      ...dateTimeInfo,
      startMonth: month,
      startMonthTitle
    })
  }
  const handleSelectMonthEnd = (value) => {
    console.log('end month', value)
    const month = `${value.slice(3, 7)}-${value.slice(0, 2)}`
    const endMonthTitle = `${value.slice(0, 2)}-${value.slice(3, 7)}`

    setDateTimeInfo({
      ...dateTimeInfo,
      endMonth: month,
      endMonthTitle
    })
  }

  const handleSearchData = () => {
    if (startMonth.length != 0 && endMonth.length != 0) {
      const start = new Date(`${startMonth}-01`)
      const end = new Date(`${endMonth}-01`)
      end.setMonth(end.getMonth() + 1)

      const riskListBetween = state.riskList.filter((risk) => isBetweenDate(risk.occurrenceDate, start, end))
      console.log(riskListBetween)
      setState({
        ...state,
        lists: riskListBetween
      })
    }
  }
  // Vẽ biểu đồ

  const setStatisticalChartData = () => {
    // Tao du lieu cac thang
    let start = new Date('2020-10-01')
    let end = new Date('2021-05-01')
    if (startMonth.length != 0 && endMonth.length != 0) {
      start = new Date(`${startMonth}-01`)
      end = new Date(`${endMonth}-01`)
    }

    // start = dayjs(start).format('DD-MM-YYYY')
    end.setMonth(end.getMonth() + 1)
    const numMonthsBetween = DateDiff.inMonths(start, end)
    const months = []
    const data = []
    let monthStart = start
    for (let i = 1; i <= numMonthsBetween; i++) {
      // console.log(start)
      // month = startMonth
      const month = new Date(start)
      month.setMonth(month.getMonth() + i)
      const monthStr = new Date(start)
      monthStr.setMonth(monthStr.getMonth() + i - 1)
      months.push(dayjs(monthStr).format('MM-YYYY'))
      const numOfRisk = lists.filter((risk) => isBetweenDate(risk.occurrenceDate, monthStart, month)).length
      data.push(numOfRisk)
      monthStart = month
    }
    let x = []
    x = x.concat(months)

    return {
      data,
      labels: x
    }
  }
  const setClassificationChartData = (type) => {
    const IMPACT = 2
    const RANKING = 1
    const PROB = 3
    const options = {
      slices: []
    }
    if (type == RANKING) {
      const low = [translate('risk_dash.risk_matrix.minor')].concat(lists.filter((risk) => risk.ranking <= 3).length)
      const medium = [translate('risk_dash.risk_matrix.moderate')].concat(
        lists.filter((risk) => risk.ranking > 3 && risk.ranking <= 6).length
      )
      const high = [translate('risk_dash.risk_matrix.major')].concat(lists.filter((risk) => risk.ranking > 6 && risk.ranking <= 9).length)
      const veryHigh = [translate('risk_dash.risk_matrix.severe')].concat(lists.filter((risk) => risk.ranking > 9).length)
      const rs = []
      rs.data = [['Language', 'Speakers (in millions)'], low, medium, high, veryHigh]
      const colors = getRankingColors()
      options.slices = colors.map((color) => {
        return { color }
      })
      options.is3D = true
      // console.log('slices',options.)
      rs.options = options
      rs.options.plugins = {
        tooltip: {
          callbacks: {
            label(context) {
              let label = context.dataset.label || ''

              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += `${context.parsed.y} ${translate('risk_dash.risks')}`
              }
              return label
            }
          }
        }
      }

      return rs
    }
    if (type == PROB) {
      const low = [translate('risk_dash.low')].concat(
        lists.filter((r) => {
          const riskDis = riskDistribution.lists.find((rd) => rd.riskID == r.riskID)
          return riskDis?.prob <= 0.5
        }).length
      )
      const medium = [translate('risk_dash.medium')].concat(
        lists.filter((r) => {
          const riskDis = riskDistribution.lists.find((rd) => rd.riskID == r.riskID)
          return riskDis.prob > 0.5 && riskDis.prob <= 0.9
        }).length
      )
      const high = [translate('risk_dash.high')].concat(
        lists.filter((r) => {
          const riskDis = riskDistribution.lists.find((rd) => rd.riskID == r.riskID)
          return riskDis?.prob > 0.9
        }).length
      )
      // if(high[1]==0)  high[1]=0.000000000001
      // let veryHigh = [translate('risk_dash.risk_matrix.severe')].concat(lists.filter(risk => risk.ranking > 9).length)
      const rs = []
      rs.data = [['Language', 'Speakers (in millions)'], low, medium, high]

      rs.options = {
        sliceVisibilityThreshold: 0,
        is3D: true,
        slices: [getRiskColor(0.4), getRiskColor(0.5), getRiskColor(0.9)].map((c) => {
          return { color: c }
        })
      }
      return rs
    }
    if (type == IMPACT) {
      const low = [translate('risk_dash.risk_matrix.low')].concat(
        lists.filter((risk) => Math.max(risk.impact.security, risk.impact.health, risk.impact.enviroment) == 1).length
      )
      const medium = [translate('risk_dash.risk_matrix.medium')].concat(
        lists.filter((risk) => Math.max(risk.impact.security, risk.impact.health, risk.impact.enviroment) == 2).length
      )
      const high = [translate('risk_dash.risk_matrix.high')].concat(
        lists.filter((risk) => Math.max(risk.impact.security, risk.impact.health, risk.impact.enviroment) == 3).length
      )
      const veryHigh = [translate('risk_dash.risk_matrix.very_high')].concat(
        lists.filter((risk) => Math.max(risk.impact.security, risk.impact.health, risk.impact.enviroment) == 4).length
      )
      const rs = []
      rs.data = [['Language', 'Speakers (in millions)'], low, medium, high, veryHigh]
      rs.options = {
        sliceVisibilityThreshold: 0,
        is3D: true,
        slices: getRankingColors().map((c) => {
          return { color: c }
        })
      }

      return rs
    }

    return []
  }

  const [lineChartData, setLineChartData] = useState({
    data: null,
    option: null
  })
  const [ratioChart, setRatioChart] = useState(null)
  useEffect(() => {
    console.log(getStorage('currentRole'))
    if (lists.length != 0) {
      const lineData = setStatisticalChartData()
      const data = {
        labels: lineData.labels,
        datasets: [
          {
            label: translate('risk_dash.risk_in_month'),
            data: lineData.data,
            fill: false,
            backgroundColor: '#2E64FE',
            borderColor: '#0080FF',
            pointBorderColor: '#111',
            pointBackgroundColor: '#ff4000',
            pointBorderWidth: 2
          }
        ]
      }
      const options = {
        title: {
          display: true,
          text: 'abc'
        },
        responsive: true,
        layout: {
          padding: '1em'
        },
        plugins: {
          tooltip: {
            callbacks: {
              label(context) {
                let label = context.dataset.label || ''

                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += `${context.parsed.y} ${translate('risk_dash.risks')}`
                }
                return label
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: translate('risk_dash.quantity')
            },
            ticks: {
              // Include a dollar sign in the ticks
              callback(value, index, values) {
                return value
              }
            }
          },
          x: {
            title: {
              display: true,
              text: translate('risk_dash.time')
            }
          }
        }
      }
      setLineChartData({
        ...lineChartData,
        data,
        option: options
      })
      // pie chart
      const rs = setClassificationChartData(type)
      setRatioChart({
        ...ratioChart,
        data: rs.data,
        options: rs.options
      })
    }
  }, [lists, type])
  const handleChangeType = (event) => {
    const val = event.target.value
    // alert(val)
    setState({
      ...state,
      type: val
    })
  }
  const handleChangeUnit = (event) => {
    const val = event.target.value
    console.log(val)
  }
  return (
    <>
      <div className='box qlcv' style={{ textAlign: 'center' }}>
        <div className='row' style={{ textAlign: 'center' }}>
          <h3>
            <strong>{state.currentDepartment && state.currentDepartment.name.toUpperCase()}</strong>
          </h3>
        </div>
        {/** Chọn ngày bắt đầu */}
        <div className='form-inline'>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.from')}</label>
            <DatePicker
              id='monthStartInTaskDashBoard'
              dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
              value={startMonthTitle} // giá trị mặc định cho datePicker
              onChange={handleSelectMonthStart}
              disabled={false} // sử dụng khi muốn disabled, mặc định là false
            />
          </div>

          {/** Chọn ngày kết thúc */}
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.to')}</label>
            <DatePicker
              id='monthEndInTaskDashBoard'
              dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
              value={endMonthTitle} // giá trị mặc định cho datePicker
              onChange={handleSelectMonthEnd}
              disabled={false} // sử dụng khi muốn disabled, mặc định là false
            />
          </div>

          {/** button tìm kiếm data để vẽ biểu đồ */}
          <div className='form-group'>
            <button type='button' className='btn btn-success' onClick={handleSearchData}>
              {translate('kpi.evaluation.employee_evaluation.search')}
            </button>
          </div>
        </div>
      </div>
      <br />
      <br />

      <div className='row'>
        <div className='col-md-3 col-sm-6 col-xs-12'>
          <div className='info-box'>
            <span className='info-box-icon bg-aqua'>
              <i className='fa fa-plus' />
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>{translate('risk_dash.total_risk')}</span>
              <span className='info-box-number'>{lists.length}</span>
            </div>
          </div>
        </div>
        <div className='col-md-3 col-sm-6 col-xs-12'>
          <div className='info-box'>
            <span className='info-box-icon bg-green'>
              <i className='fa fa-spinner' />
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>{translate('manage_risk.inprocess')}</span>
              <span className='info-box-number'>{lists.filter((r) => r.riskStatus == 'inprocess').length}</span>
            </div>
          </div>
        </div>
        <div className='col-md-3 col-sm-6 col-xs-12'>
          <div className='info-box'>
            <span className='info-box-icon bg-orange'>
              <i className='fa fa-spinner' />
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>{translate('manage_risk.wait_for_approve')}</span>
              <span className='info-box-number'>{lists.filter((r) => r.riskStatus == 'wait_for_approve').length}</span>
            </div>
          </div>
        </div>
        <div className='col-md-3 col-sm-6 col-xs-12'>
          <div className='info-box'>
            <span className='info-box-icon bg-red'>
              <i className='fa fa-check-square-o' />
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>{translate('manage_risk.finished')}</span>
              <span className='info-box-number'>{lists.filter((r) => r.riskStatus == 'finished').length}</span>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col-md-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>{`${translate('risk_dash.general')}(${lists.length})`}</div>
            </div>
            <div className='qlcv box-body'>
              <div className='nav-tabs-custom'>
                <ul className='general-tabs nav nav-tabs'>
                  <li className='active'>
                    <a className='general-task-type' href='#urgentRisk' data-toggle='tab'>
                      <img style={{ width: '18px', height: '18px', marginRight: '5px' }} src={urgentIcon} alt='urgent' />
                      {translate('risk_dash.urgency')} <span>{`(${state.urgentRisk ? state.urgentRisk.length : 0})`}</span>
                    </a>
                  </li>
                  <li>
                    <a className='general-task-type' href='#approvableRisk' data-toggle='tab'>
                      <img src={todoIcon} alt='todo' style={{ width: '20px', marginRight: '5px' }} /> {translate('risk_dash.need_approval')}
                      <span>{`(${state.approvableRisk ? state.approvableRisk.length : 0})`}</span>
                    </a>
                  </li>
                  <li>
                    <a className='general-task-type' href='#highProbRisk' data-toggle='tab'>
                      {translate('risk_dash.high_probability')}
                      <span>{`(${state.highProbRisk ? state.highProbRisk.length : 0})`}</span>
                    </a>
                  </li>
                  <li>
                    <a className='general-task-type' href='#highImpactRisk' data-toggle='tab'>
                      {translate('risk_dash.high_impact')}
                      <span>{`(${state.highImpactRisk ? state.highImpactRisk.length : 0})`}</span>
                    </a>
                  </li>
                  <li>
                    <a className='general-task-type' href='#todayRisk' data-toggle='tab'>
                      {translate('risk_dash.occurred_today')}
                      <span>{`(${state.todayRisk ? state.todayRisk.length : 0})`}</span>
                    </a>
                  </li>
                  <li>
                    <a className='general-task-type' href='#finishedRisk' data-toggle='tab'>
                      {translate('risk_dash.finished')}
                      <span>{`(${state.finishedRisk ? state.finishedRisk.length : 0})`}</span>
                    </a>
                  </li>
                  <li>
                    <a className='general-task-type' href='#inprocessRisk' data-toggle='tab'>
                      {translate('risk_dash.processed')}
                      <span>{`(${state.inprocessRisk ? state.inprocessRisk.length : 0})`}</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className='tab-content' id='general-tasks-wraper' style={{ height: '300px' }}>
                <div
                  className='tab-pane active notifi-tab-pane StyleScrollDiv StyleScrollDiv-y'
                  id='urgentRisk'
                  style={{ height: '300px' }}
                >
                  {state.urgentRisk.length != 0 && (
                    <RiskDetail
                      lists={state.urgentRisk}
                      riskDis={props.riskDistribution.length != 0 && props.riskDistribution}
                      type=''
                      id='urgentRisk'
                    />
                  )}
                </div>
                <div className='tab-pane notifi-tab-pane StyleScrollDiv StyleScrollDiv-y' id='approvableRisk' style={{ height: '300px' }}>
                  {state.approvableRisk.length != 0 && (
                    <RiskDetail
                      lists={state.approvableRisk}
                      riskDis={props.riskDistribution.length != 0 && props.riskDistribution}
                      type=''
                      id='approvableRisk'
                    />
                  )}
                </div>
                <div className='tab-pane notifi-tab-pane StyleScrollDiv StyleScrollDiv-y' id='highProbRisk' style={{ height: '300px' }}>
                  {state.highProbRisk.length != 0 && (
                    <RiskDetail
                      lists={state.highProbRisk}
                      riskDis={props.riskDistribution.length != 0 && props.riskDistribution}
                      type=''
                      id='highProbRisk'
                    />
                  )}
                </div>
                <div className='tab-pane notifi-tab-pane StyleScrollDiv StyleScrollDiv-y' id='highImpactRisk' style={{ height: '300px' }}>
                  {state.highImpactRisk.length != 0 && (
                    <RiskDetail
                      lists={state.highImpactRisk}
                      riskDis={props.riskDistribution.length != 0 && props.riskDistribution}
                      type=''
                      id='highImpactRisk'
                    />
                  )}
                </div>
                <div className='tab-pane notifi-tab-pane StyleScrollDiv StyleScrollDiv-y' id='todayRisk' style={{ height: '300px' }}>
                  {state.todayRisk.length != 0 && (
                    <RiskDetail
                      lists={state.todayRisk}
                      riskDis={props.riskDistribution.length != 0 && props.riskDistribution}
                      type=''
                      id='todayRisk'
                    />
                  )}
                </div>
                <div className='tab-pane notifi-tab-pane StyleScrollDiv StyleScrollDiv-y' id='inprocessRisk' style={{ height: '300px' }}>
                  <RiskDetail
                    lists={state.inprocessRisk.length != 0 && state.inprocessRisk}
                    riskDis={props.riskDistribution.length != 0 && props.riskDistribution}
                    type=''
                    id='inprocessRisk'
                  />
                </div>
                <div className='tab-pane notifi-tab-pane StyleScrollDiv StyleScrollDiv-y' id='finishedRisk' style={{ height: '300px' }}>
                  <RiskDetail
                    lists={state.finishedRisk.length != 0 && state.finishedRisk}
                    riskDis={props.riskDistribution.length != 0 && props.riskDistribution}
                    type=''
                    id='finishedRisk'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-6'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {translate('risk_dash.quantity')} {translate('task.task_management.lower_from')} {startMonthTitle}{' '}
                {translate('task.task_management.lower_to')} {endMonthTitle}
              </div>
            </div>
            {lineChartData != null && <Line data={lineChartData.data} options={lineChartData.option} />}
          </div>
        </div>
        <div className='col-xs-6'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {translate('risk_dash.chart_title_1')} {translate('task.task_management.lower_from')} {startMonthTitle}{' '}
                {translate('task.task_management.lower_to')} {endMonthTitle}
              </div>
            </div>
            <div className='box-body'>
              <div className='form-group'>
                <label>{translate('risk_dash.criteria')} </label>
                <select style={{ width: '50%' }} className='form-control' onChange={handleChangeType}>
                  <option value='1'>{translate('risk_dash.ranking')}</option>
                  <option value='2'>{translate('risk_dash.impact_level')}</option>
                  <option value='3'>{translate('risk_dash.occurrence_probability')}</option>
                </select>
              </div>

              {ratioChart != null && ratioChart.data && (
                <Chart
                  width='600px'
                  height='300px'
                  chartType='PieChart'
                  loader={<div>Loading Chart</div>}
                  data={ratioChart.data}
                  options={ratioChart.options}
                  rootProps={{ 'data-testid': '1' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
function mapState(state) {
  const { risk, user, riskDistribution, role, tasks } = state
  return { risk, user, riskDistribution, role, tasks }
}

const actions = {
  getAllUserOfCompany: UserActions.getAllUserOfCompany,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  showInfoRole: RoleActions.show,
  getRiskDistributions: RiskDistributionActions.getRiskDistributions,
  getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
  getParentsOfRisk: RiskDistributionActions.getParentsOfRisk,
  deleteRiskDistribution: RiskDistributionActions.deleteRiskDistribution,
  // bayesianNetworkAutoConfig: RiskDistributionActions.bayesianNetworkAutoConfig,
  getRisks: riskActions.getRisks,
  updateProb: RiskDistributionActions.updateProb,
  getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
  show: RoleActions.show,
  getDepartmentOfUser: UserActions.getDepartmentOfUser
}

const connectedRiskDashboardForm = connect(mapState, actions)(withTranslate(RiskDashboard))
export { connectedRiskDashboardForm as RiskDashboard }
