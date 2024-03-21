import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'

import { taskManagementActions } from '../../task/task-management/redux/actions'

import { DatePicker, SlimScroll, LazyLoadComponent, forceCheckOrVisible } from '../../../common-components'
import { GanttCalendar } from '../../task/task-dashboard/task-personal-dashboard/ganttCalendar'
import GeneralTaskPersonalChart from '../../task/task-dashboard/task-personal-dashboard/generalTaskPersonalChart'
import { NewsFeed } from './newsFeed'
import './alarmTask.css'
import ViewAllTasks from '../components/viewAllTask'
import moment from 'moment'
import { filterDifference } from '../../../helpers/taskModuleHelpers'
class SuperHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userID: '',
      willUpdate: false, // Khi true sẽ cập nhật dữ liệu vào props từ redux
      callAction: false,
      startDate: this.formatDate(Date.now(), true, 3),
      endDate: this.formatDate(Date.now(), true)
    }
  }
  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
   */
  formatDate(date, monthYear = false, monthChange) {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
      if (monthChange) {
        if (month <= monthChange) {
          year = year - 1
          month = Number(month) + 12 - monthChange
        } else {
          month = month - monthChange
        }
      }
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    }
    return date
  }
  static getDerivedStateFromProps(props, state) {
    const { tasks } = props
    const { loadingInformed, loadingCreator, loadingConsulted, loadingAccountable, loadingResponsible } = tasks
    const { userId } = state
    if (tasks && !loadingInformed && !loadingCreator && !loadingConsulted && !loadingAccountable && !loadingResponsible) {
      let currentMonth = new Date().getMonth() + 1
      let currentYear = new Date().getFullYear()
      let notLinkedTasks = [],
        taskList = [],
        unconfirmedTask = [],
        noneUpdateTask = [],
        distinctTasks = [],
        taskHasActionsResponsible = [],
        taskHasActionsAccountable = [],
        taskHasNotEvaluationResultIncurrentMonth = [],
        taskHasNotApproveResquestToClose = []
      const taskOfUser = tasks?.tasks

      let accTasks = tasks.accountableTasks
      let resTasks = tasks.responsibleTasks
      let conTasks = tasks.consultedTasks

      if (accTasks && accTasks.length > 0) accTasks = accTasks.filter((task) => task.status === 'inprocess')
      if (resTasks && resTasks.length > 0) resTasks = resTasks.filter((task) => task.status === 'inprocess')
      if (conTasks && conTasks.length > 0) conTasks = conTasks.filter((task) => task.status === 'inprocess')

      // Láy công việc chưa phê duyệt yêu cầu kết thúc
      accTasks &&
        accTasks.forEach((o) => {
          if (o.requestToCloseTask && o.requestToCloseTask.requestStatus === 1) {
            taskHasNotApproveResquestToClose = [...taskHasNotApproveResquestToClose, o]
          }
        })

      // tính toán lấy số công việc chưa được đánh giá kpi
      if (accTasks && resTasks && conTasks) {
        taskList = [...accTasks, ...resTasks, ...conTasks]
        if (taskList && taskList.length > 0) {
          distinctTasks = filterDifference(taskList)

          distinctTasks.length &&
            distinctTasks.map((x) => {
              let evaluations
              let currentEvaluate = []
              let created = moment(x.createdAt)
              let lastUpdate = moment(x.updatedAt)
              let now = moment(new Date())
              let updatedToNow = now.diff(lastUpdate, 'days')
              let createdToNow = now.diff(created, 'days')
              if (updatedToNow >= 7) {
                let add = {
                  ...x,
                  updatedToNow
                }
                noneUpdateTask.push(add)
              }

              if (x?.confirmedByEmployees.length === 0 || !x?.confirmedByEmployees.includes(localStorage.getItem('userId'))) {
                let add = {
                  ...x,
                  createdToNow
                }
                unconfirmedTask.push(add)
              }

              evaluations = x.evaluations.length && x.evaluations
              for (let i in evaluations) {
                let month = evaluations[i] && evaluations[i].evaluatingMonth && evaluations[i].evaluatingMonth.slice(5, 7)
                let year = evaluations[i] && evaluations[i].evaluatingMonth && evaluations[i].evaluatingMonth.slice(0, 4)
                if (month == currentMonth && year == currentYear) {
                  currentEvaluate.push(evaluations[i])
                }
              }
              if (currentEvaluate.length === 0) notLinkedTasks.push(x)
              else {
                let break1 = false
                let add = true
                if (currentEvaluate.length !== 0)
                  for (let i in currentEvaluate) {
                    if (currentEvaluate[i].results.length !== 0) {
                      for (let j in currentEvaluate[i].results) {
                        let res = currentEvaluate[i].results[j]

                        if (res.employee === userId) {
                          add = false
                          if (res.kpis.length === 0) {
                            notLinkedTasks.push(x)
                            break1 = true
                          }
                        }
                        if (break1) break
                      }
                      if (break1) break
                      if (add) notLinkedTasks.push(x)
                    }
                  }
              }
            })

          // Lấy các công việc chưa có kết quả đánh giá ở tháng hiện tại
          distinctTasks.length &&
            distinctTasks.forEach((o, index) => {
              if (o.evaluations && o.evaluations.length > 0) {
                let lengthEvaluations = o.evaluations.length
                let add = true
                for (let i = 0; i <= lengthEvaluations; i++) {
                  let currentEvaluationsMonth =
                    o.evaluations[i] && o.evaluations[i].evaluatingMonth && o.evaluations[i].evaluatingMonth.slice(5, 7)
                  let currentEvaluationsYear =
                    o.evaluations[i] && o.evaluations[i].evaluatingMonth && o.evaluations[i].evaluatingMonth.slice(0, 4)

                  if (parseInt(currentEvaluationsMonth) === currentMonth && parseInt(currentEvaluationsYear) === currentYear) {
                    add = false
                  }
                }
                if (add) taskHasNotEvaluationResultIncurrentMonth.push(o)
              } else {
                taskHasNotEvaluationResultIncurrentMonth.push(o)
              }
            })
        }
      }

      // Tính toán lấy số công việc chưa được đánh gia
      if (resTasks?.length > 0) {
        resTasks.forEach((x) => {
          let taskActions

          taskActions = x.taskActions.length && x.taskActions
          for (let i in taskActions) {
            let month = taskActions[i].createdAt.slice(5, 7)
            let year = taskActions[i].createdAt.slice(0, 4)
            if (month == currentMonth && year == currentYear) {
              if (taskActions[i].rating == -1) {
                taskHasActionsResponsible.push(x)
                break
              }
            }
          }
        })
      }

      // Tính toán lấy số công việc cần đánh giá
      if (accTasks?.length > 0) {
        accTasks.forEach((x) => {
          let taskActions

          taskActions = x.taskActions.length && x.taskActions
          for (let i in taskActions) {
            let month = taskActions[i].createdAt.slice(5, 7)
            let year = taskActions[i].createdAt.slice(0, 4)
            if (month == currentMonth && year == currentYear) {
              if (taskActions[i].rating == -1) {
                taskHasActionsAccountable.push(x)
                break
              }
            }
          }
        })
      }

      return {
        listTasksGeneral: distinctTasks,
        listAlarmTask: {
          notLinkedTasks,
          unconfirmedTask,
          noneUpdateTask,
          taskHasActionsAccountable,
          taskHasActionsResponsible,
          taskHasNotEvaluationResultIncurrentMonth,
          taskHasNotApproveResquestToClose
        }
      }
    } else {
      return null
    }
  }

  componentDidMount = async () => {
    let { startDate, endDate } = this.state
    console.log('startDate', startDate)
    let startDateWork = moment(startDate, 'MM-YYYY').format('YYYY-MM')
    let endDateWork = moment(endDate, 'MM-YYYY').format('YYYY-MM')
    await this.props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
    await this.props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
    await this.props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
    await this.props.getInformedTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
    await this.props.getCreatorTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
  }

  shouldComponentUpdate(nextProps, nextState) {
    window.$('#dashboard-about-to-overdue').ready(function () {
      SlimScroll.removeVerticalScrollStyleCSS('dashboard-about-to-overdue')
      SlimScroll.addVerticalScrollStyleCSS('dashboard-about-to-overdue', 300, true)
    })

    window.$('#dashboard-overdue').ready(function () {
      SlimScroll.removeVerticalScrollStyleCSS('dashboard-overdue')
      SlimScroll.addVerticalScrollStyleCSS('dashboard-overdue', 300, true)
    })

    return true
  }
  generateDataPoints(noOfDps) {
    let xVal = 1,
      yVal = 100
    let dps = []
    for (let i = 0; i < noOfDps; i++) {
      yVal = yVal + Math.round(5 + Math.random() * (-5 - 5))
      dps.push({ x: xVal, y: yVal })
      xVal++
    }
    return dps
  }

  handleSelectMonthStart = (value) => {
    this.setState({ startDate: value })
  }

  handleSelectMonthEnd = (value) => {
    this.setState({ endDate: value })
  }

  handleSearchData = async () => {
    let { startDate, endDate } = this.state
    /* console.log("startDate", startDate)
        console.log("endDate",endDate) */
    let startTimeMiliSeconds = new Date(moment(startDate, 'MM-YYYY').format()).getTime()
    let endTimeMiliSeconds = new Date(moment(endDate, 'MM-YYYY').format()).getTime()
    /* console.log("startTimeMiliSeconds", startTimeMiliSeconds) */
    if (startTimeMiliSeconds > endTimeMiliSeconds) {
      const { translate } = this.props
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else {
      let { startDate, endDate } = this.state
      let startDateWork = moment(startDate, 'MM-YYYY').format('YYYY-MM')
      let endDateWork = moment(endDate, 'MM-YYYY').format('YYYY-MM')
      this.props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
      this.props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
      this.props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
      this.props.getInformedTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true)
    }
  }

  viewAllTask = () => {
    window.$('#modal-view-all-task').modal('show')
  }

  render() {
    const { tasks, translate } = this.props
    const { loadingInformed, loadingCreator, loadingConsulted, loadingAccountable } = tasks

    const { listAlarmTask, listTasksGeneral, startDate, endDate } = this.state
    let startDateWork = moment(startDate, 'MM-YYYY').format('YYYY-MM')
    let endDateWork = moment(endDate, 'MM-YYYY').format('YYYY-MM')

    return (
      <React.Fragment>
        {listAlarmTask && <ViewAllTasks listAlarmTask={listAlarmTask} />}
        <div className='qlcv' style={{ marginBottom: 10 }}>
          {/**Chọn ngày bắt đầu */}
          <div className='form-inline'>
            <div className='form-group'>
              <label style={{ width: 'auto' }}>{translate('task.task_management.from')}</label>
              <DatePicker
                id='monthStartInHome'
                dateFormat='month-year'
                value={this.state.startDate}
                onChange={this.handleSelectMonthStart}
                disabled={false}
              />
            </div>

            {/**Chọn ngày kết thúc */}
            <div className='form-group'>
              <label style={{ width: 'auto' }}>{translate('task.task_management.to')}</label>
              <DatePicker
                id='monthEndInHome'
                dateFormat='month-year'
                value={this.state.endDate}
                onChange={this.handleSelectMonthEnd}
                disabled={false}
              />
            </div>

            {/**button tìm kiếm data để vẽ biểu đồ */}
            <div className='form-group'>
              <button type='button' className='btn btn-success' onClick={this.handleSearchData}>
                {translate('kpi.evaluation.employee_evaluation.search')}
              </button>
            </div>
          </div>
        </div>

        <div className='nav-tabs-custom'>
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a href='#tasks-oveview' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                Tổng quan công việc
              </a>
            </li>
            <li>
              <a href='#tasks-calendar' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                {translate('task.task_management.tasks_calendar')}
              </a>
            </li>
            <li>
              <a href='#newfeeds' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                {translate('news_feed.news_feed')}
              </a>
            </li>
          </ul>

          <div className='tab-content'>
            <div className='tab-pane active' id='tasks-oveview'>
              <div className='box-header with-border'>
                <div className='box-title'>{`Tổng quan công việc (${listTasksGeneral ? listTasksGeneral.length : 0})`}</div>
              </div>
              {listTasksGeneral && listTasksGeneral.length > 0 ? (
                <LazyLoadComponent once={true}>
                  <GeneralTaskPersonalChart tasks={listTasksGeneral} />
                </LazyLoadComponent>
              ) : loadingInformed && loadingCreator && loadingConsulted && loadingAccountable ? (
                <div className='table-info-panel'>{translate('confirm.loading')}</div>
              ) : (
                <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>

            <div className='tab-pane' id='tasks-calendar'>
              <div className='box box-primary'>
                <div className='box-header with-border'>
                  <div className='box-title'>
                    {translate('task.task_management.tasks_calendar')} {translate('task.task_management.lower_from')} {startDateWork}{' '}
                    {translate('task.task_management.lower_to')} {endDateWork}
                  </div>
                </div>
                <LazyLoadComponent once={true}>
                  <GanttCalendar tasks={tasks} unitOrganization={false} />
                </LazyLoadComponent>
              </div>
            </div>

            <div className='tab-pane' id='newfeeds'>
              <LazyLoadComponent once={true}>
                <NewsFeed />
              </LazyLoadComponent>
            </div>
          </div>
        </div>

        {/* Tổng quan công việc cá nhân */}
        {/* <div className="row">
                    <div className="col-md-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{`Tổng quan công việc (${listTasksGeneral ? listTasksGeneral.length : 0})`}</div>
                            </div>
                            {
                                listTasksGeneral && listTasksGeneral.length > 0 ?
                                    <LazyLoadComponent once={true}>
                                        <GeneralTaskPersonalChart
                                            tasks={listTasksGeneral}
                                        />
                                    </LazyLoadComponent>
                                    : (loadingInformed && loadingCreator && loadingConsulted && loadingAccountable) ?
                                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                        <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </div>

                    </div>
                </div> */}

        {/* Lịch công việc chi tiết */}
        {/* <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.tasks_calendar')} {translate('task.task_management.lower_from')} {startDateWork} {translate('task.task_management.lower_to')} {endDateWork}</div>
                            </div>
                            <LazyLoadComponent once={true}>
                                <GanttCalendar
                                    tasks={tasks}
                                    unitOrganization={false}
                                />
                            </LazyLoadComponent>
                        </div>
                    </div>
                </div> */}

        {/* News feed */}
        {/* <div className="row">
                    <div className="col-xs-12">
                        <LazyLoadComponent once={true}>
                            <NewsFeed />
                        </LazyLoadComponent>
                    </div>
                </div> */}

        {/* <input className="alarmTask" type="checkbox" id="toggle-1"></input> */}
        <label className='alarm-task-arrow animated alram-task-bounce' htmlFor='toggle-1' onClick={this.viewAllTask}>
          <span className='material-icons'>alarm</span>
        </label>
        {/* <div className="alarm-task-popup">
                    <div className="alarm-task-popup-header">
                        <label htmlFor="toggle-1"><i className="fa fa-times close-icon-popup" aria-hidden="true"></i></label>
                        <h5 className="alarm-task-popup-title" >
                            <span className="material-icons" style={{ marginRight: '5px', color: "#fb6b6b" }}>
                                alarm
                                </span>
                                Nhắc việc
                            </h5>
                    </div>
                    <div className="alarm-task-popup-content">
                        <ul style={{ paddingLeft: '10px', listStyle: "none" }}>
                            <li className="list-todo-alarm"><a href="#" onClick={() => this.viewAllTask(noneUpdateTask, translate('task.task_dashboard.none_update_recently'))}>{`Chưa cập nhật trong 7 ngày gần nhất (${noneUpdateTask ? noneUpdateTask.length : 0})`}</a></li>
                            <li className="list-todo-alarm"><a href="#" onClick={() => this.viewAllTask(unconfirmedTask, translate('task.task_dashboard.unconfirmed_task'))}>{`Chưa xác nhận thực hiện (${unconfirmedTask ? unconfirmedTask.length : 0})`}</a></li>
                            <li className="list-todo-alarm"><a href="#" onClick={() => this.viewAllTask(notLinkedTasks, translate('task.task_management.task_is_not_linked_up_with_monthly_kpi'))}>{`Chưa liên kết KPI (${notLinkedTasks ? notLinkedTasks.length : 0})`}</a></li>
                            <li className="list-todo-alarm"><a href="#" onClick={() => this.viewAllTask(taskHasActionsResponsible, 'Chưa được đánh giá hoạt động')}>{`Chưa được đánh giá hoạt động (${taskHasActionsResponsible ? taskHasActionsResponsible.length : 0})`}</a></li>
                            <li className="list-todo-alarm"><a href="#" onClick={() => this.viewAllTask(taskHasActionsAccountable, 'Chưa đánh giá công việc')}>{`Chưa đánh giá công việc (${taskHasActionsAccountable ? taskHasActionsAccountable.length : 0})`}</a></li>
                        </ul>
                    </div>
                </div> */}
      </React.Fragment>
    )
  }
}

function mapState(state) {
  const { tasks } = state
  return { tasks }
}
const actionCreators = {
  getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
  getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
  getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
  getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
  getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser
}
const connectedHome = connect(mapState, actionCreators)(withTranslate(SuperHome))
export { connectedHome as SuperHome }
