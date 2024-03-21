import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { SlimScroll, ToolTip } from '../../../../common-components'

import './generalProcessChart.css'
import { TaskProcessActions } from '../../task-process/redux/actions'
import { ModalViewProcess } from '../../task-process/component/task-process-management/modalViewProcess'

const getNumberTaskFinished = (listTask) => {
  if (listTask) {
    const tasksFinished = listTask.filter((item) => item.status === 'finished')
    return tasksFinished?.length || 0
  }

  return 0
}

const getTaskOutputs = (listTask) => {
  let numberTaskOutput = 0,
    taskOutputsApproved = 0
  if (listTask) {
    for (let i in listTask) {
      if (listTask[i]) {
        for (let j in listTask[i].taskOutputs) {
          numberTaskOutput = numberTaskOutput + 1
          if (listTask[i].taskOutputs[j].status === 'approved') {
            taskOutputsApproved = taskOutputsApproved + 1
          }
        }
      }
    }
  }
  if (numberTaskOutput > 0) {
    return `${taskOutputsApproved}/${numberTaskOutput}`
  }

  return 'Không có yêu cầu kết quả giao nộp'
}

const GeneralTaskProcessChart = (props) => {
  const { department, taskProcess, translate } = props
  const [state, setState] = useState({
    userId: localStorage.getItem('userId')
  })

  const [currentRow, setCurrentRow] = useState()
  let listOrganizationalUnit = department?.list
  const listTaskProcess = taskProcess?.listTaskProcess

  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  const isManager = (itemProcess) => {
    let { currentUser, currentRole } = state
    let check = false
    let manager = itemProcess.manager
    for (let x in manager) {
      if (manager[x].id === currentUser || manager[x].id === currentRole) {
        check = true
      }
    }
    return check
  }

  useEffect(() => {
    dayjs.extend(isSameOrAfter)

    let overdueTaskProcess = [],
      deadlineIncoming = [],
      inprocess = []
    // xu ly du lieu
    if (listTaskProcess && listTaskProcess.length) {
      for (let i in listTaskProcess) {
        let end = dayjs(listTaskProcess[i].endDate)
        let now = dayjs(new Date())
        let nowToEnd = end.diff(now, 'day')

        if (listTaskProcess[i].status === 'inprocess') {
          inprocess.push(listTaskProcess[i])
          if (now > end) {
            //viec Quá hạn
            let add = {
              ...listTaskProcess[i],
              nowToEnd: -parseInt(nowToEnd)
            }
            overdueTaskProcess.push(add)
          } else {
            if (nowToEnd <= 7) {
              let add = {
                ...listTaskProcess[i],
                totalDays: nowToEnd
              }
              deadlineIncoming.push(add)
            }
          }
        }
      }
    }

    overdueTaskProcess?.length > 0 && overdueTaskProcess.sort((a, b) => (a.nowToEnd < b.nowToEnd ? 1 : -1))
    deadlineIncoming?.length > 0 && deadlineIncoming.sort((a, b) => (a.totalDays < b.totalDays ? 1 : -1))

    setState({
      ...state,
      deadlineIncoming,
      overdueTaskProcess,
      inprocess
    })
  }, [listTaskProcess])

  const viewProcess = async (item) => {
    await setCurrentRow(item)
    window.$(`#modal-view-process-task-list`).modal('show')
  }

  return (
    <div className='qlcv box-body'>
      {currentRow !== undefined && (
        <ModalViewProcess
          title={translate('task.task_process.view_task_process_modal')}
          listOrganizationalUnit={listOrganizationalUnit}
          data={currentRow}
          idProcess={currentRow._id}
          xmlDiagram={currentRow.xmlDiagram}
          processName={currentRow.processName}
          processDescription={currentRow.processDescription}
          infoTask={currentRow.taskList}
          creator={currentRow.creator}
          checkManager={isManager(currentRow)}
        />
      )}
      <div className='nav-tabs-custom'>
        <ul className='general-tabs nav nav-tabs'>
          <li>
            <a className='general-task-type' href='#allGeneralProcessOverdue' data-toggle='tab'>
              {`${translate('task.task_dashboard.overdue_task')}`}&nbsp;
              <span>{`(${state.overdueTaskProcess ? state.overdueTaskProcess.length : 0})`}</span>
            </a>
          </li>
          <li>
            <a className='general-task-type' href='#allGeneralProcessIncoming' data-toggle='tab'>
              {`${translate('task.task_dashboard.incoming_task')}`}&nbsp;
              <span>{`(${state.deadlineIncoming ? state.deadlineIncoming.length : 0})`}</span>
            </a>
          </li>
          <li>
            <a className='general-task-type' href='#allGeneralProcessInprocess' data-toggle='tab'>
              {`Đang thực hiện`}&nbsp;<span>{`(${state.inprocess ? state.inprocess.length : 0})`}</span>
            </a>
          </li>
        </ul>
        <div className='tab-content' id='general-tasks-wraper'>
          <div
            className='tab-pane active notifi-tab-pane StyleScrollDiv StyleScrollDiv-y'
            id='allGeneralProcessOverdue'
            style={{ maxHeight: '400px' }}
          >
            {state.overdueTaskProcess ? (
              <div className='faqs-page block '>
                <div className='panel-group' id='accordion-overdue' role='tablist' aria-multiselectable='true' style={{ marginBottom: 0 }}>
                  {state.overdueTaskProcess.length !== 0 ? (
                    state.overdueTaskProcess.map((obj, index) => (
                      <div className='panel panel-default' key={index}>
                        <span
                          role='button'
                          className='item-question collapsed'
                          data-toggle='collapse'
                          data-parent='#accordion-overdue'
                          href={`#collapse-overdue${index}`}
                          aria-expanded='true'
                          aria-controls='collapse1a'
                        >
                          <span className='index'>{index + 1}</span>
                          <span className='task-name'>{obj.processName}</span>
                          <small className='label label-danger' style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>
                            {translate('task.task_dashboard.overdue')} {obj.nowToEnd} {translate('task.task_dashboard.day')}
                          </small>
                        </span>
                        <div id={`collapse-overdue${index}`} className='panel-collapse collapse' role='tabpanel'>
                          <div className='panel-body'>
                            <div className='time-todo-range'>
                              <span style={{ marginRight: '10px' }}>Thời gian thực hiện quy trình: </span>{' '}
                              <span style={{ marginRight: '5px' }}>
                                <i className='fa fa-clock-o' style={{ marginRight: '1px', color: 'rgb(191 71 71)' }}>
                                  {' '}
                                </i>{' '}
                                {formatTime(obj.startDate)}
                              </span>{' '}
                              <span style={{ marginRight: '5px' }}>-</span>{' '}
                              <span>
                                {' '}
                                <i className='fa fa-clock-o' style={{ marginRight: '4px', color: 'rgb(191 71 71)' }}>
                                  {' '}
                                </i>
                                {formatTime(obj.endDate)}
                              </span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Số công việc trong quy trình: </span>
                              <span>{obj.tasks?.length ?? 0}</span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Mức độ hoàn thành: </span>
                              <span>
                                {getNumberTaskFinished(obj.tasks)}/{obj.tasks?.length ?? 0}
                              </span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Kết quả giao nộp quy trình: </span>
                              <span>{getTaskOutputs(obj.tasks)}</span>
                            </div>
                            <div className='role-in-task'>
                              <span style={{ marginRight: '10px' }}>Người quản lý: </span>
                              {obj?.manager?.length ? <ToolTip dataTooltip={obj?.manager.map((o) => o.name)} /> : null}
                            </div>

                            <a
                              onClick={() => {
                                viewProcess(obj)
                              }}
                              target='_blank'
                              className='seemore-task'
                              style={{ cursor: 'pointer' }}
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <small style={{ color: '#696767' }}>Không có quy trình nào</small>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className='tab-pane notifi-tab-pane' id='allGeneralProcessIncoming' style={{ maxHeight: '400px' }}>
            {state.deadlineIncoming ? (
              <div className='faqs-page block '>
                <div className='panel-group' id='accordion-incoming' role='tablist' aria-multiselectable='true' style={{ marginBottom: 0 }}>
                  {state.deadlineIncoming.length !== 0 ? (
                    state.deadlineIncoming.map((obj, index) => (
                      <div className='panel panel-default' key={index}>
                        <span
                          role='button'
                          className='item-question collapsed'
                          data-toggle='collapse'
                          data-parent='#accordion-incoming'
                          href={`#collapse-incoming${index}`}
                          aria-expanded='true'
                          aria-controls='collapse1a'
                        >
                          <span className='index'>{index + 1}</span>
                          <span className='task-name'>{obj.processName}</span>
                          <small className='label label-warning' style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>
                            Còn {obj.totalDays} {translate('task.task_dashboard.day')}
                          </small>
                        </span>
                        <div id={`collapse-incoming${index}`} className='panel-collapse collapse' role='tabpanel'>
                          <div className='panel-body'>
                            <div className='time-todo-range'>
                              <span style={{ marginRight: '10px' }}>Thời gian thực hiện quy trình: </span>{' '}
                              <span style={{ marginRight: '5px' }}>
                                <i className='fa fa-clock-o' style={{ marginRight: '1px', color: 'rgb(191 71 71)' }}>
                                  {' '}
                                </i>{' '}
                                {formatTime(obj.startDate)}
                              </span>{' '}
                              <span style={{ marginRight: '5px' }}>-</span>{' '}
                              <span>
                                {' '}
                                <i className='fa fa-clock-o' style={{ marginRight: '4px', color: 'rgb(191 71 71)' }}>
                                  {' '}
                                </i>
                                {formatTime(obj.endDate)}
                              </span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Số công việc trong quy trình: </span>
                              <span>{obj.tasks?.length ?? 0}</span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Mức độ hoàn thành: </span>
                              <span>
                                {getNumberTaskFinished(obj.tasks)}/{obj.tasks?.length ?? 0}
                              </span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Kết quả giao nộp trong quy trình: </span>
                              <span>{getTaskOutputs(obj.tasks)}</span>
                            </div>
                            <div className='role-in-task'>
                              <span style={{ marginRight: '10px' }}>Người quản lý: </span>
                              {obj?.manager?.length ? <ToolTip dataTooltip={obj?.manager.map((o) => o.name)} /> : null}
                            </div>

                            <a
                              onClick={() => {
                                viewProcess(obj)
                              }}
                              className='seemore-task'
                              style={{ cursor: 'pointer' }}
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <small style={{ color: '#696767' }}>Không có quy trình nào</small>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className='tab-pane notifi-tab-pane' id='allGeneralProcessInprocess' style={{ maxHeight: '400px' }}>
            {state.inprocess ? (
              <div className='faqs-page block '>
                <div
                  className='panel-group'
                  id='accordion-inprocess'
                  role='tablist'
                  aria-multiselectable='true'
                  style={{ marginBottom: 0 }}
                >
                  {state.inprocess.length !== 0 ? (
                    state.inprocess.map((obj, index) => (
                      <div className='panel panel-default' key={index}>
                        <span
                          role='button'
                          className='item-question collapsed'
                          data-toggle='collapse'
                          data-parent='#accordion-inprocess'
                          href={`#collapse-inprocess${index}`}
                          aria-expanded='true'
                          aria-controls='collapse1a'
                        >
                          <span className='index'>{index + 1}</span>
                          <span className='task-name'>{obj.processName}</span>
                          {/* <small className="label label-warning" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>Còn {obj.totalDays} {translate('task.task_dashboard.day')}</small> */}
                        </span>
                        <div id={`collapse-inprocess${index}`} className='panel-collapse collapse' role='tabpanel'>
                          <div className='panel-body'>
                            <div className='time-todo-range'>
                              <span style={{ marginRight: '10px' }}>Thời gian thực hiện quy trình: </span>{' '}
                              <span style={{ marginRight: '5px' }}>
                                <i className='fa fa-clock-o' style={{ marginRight: '1px', color: 'rgb(191 71 71)' }}>
                                  {' '}
                                </i>{' '}
                                {formatTime(obj.startDate)}
                              </span>{' '}
                              <span style={{ marginRight: '5px' }}>-</span>{' '}
                              <span>
                                {' '}
                                <i className='fa fa-clock-o' style={{ marginRight: '4px', color: 'rgb(191 71 71)' }}>
                                  {' '}
                                </i>
                                {formatTime(obj.endDate)}
                              </span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Số công việc trong quy trình: </span>
                              <span>{obj.tasks?.length ?? 0}</span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Mức độ hoàn thành: </span>
                              <span>
                                {getNumberTaskFinished(obj.tasks)}/{obj.tasks?.length ?? 0}
                              </span>
                            </div>
                            <div className='priority-task-wraper'>
                              <span style={{ marginRight: '10px' }}>Kết quả giao nộp trong quy trình: </span>
                              <span>{getTaskOutputs(obj.tasks)}</span>
                            </div>
                            <div className='role-in-task'>
                              <span style={{ marginRight: '10px' }}>Người quản lý: </span>
                              {obj?.manager?.length ? <ToolTip dataTooltip={obj?.manager.map((o) => o.name)} /> : null}
                            </div>

                            <a
                              onClick={() => {
                                viewProcess(obj)
                              }}
                              target='_blank'
                              className='seemore-task'
                              style={{ cursor: 'pointer' }}
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <small style={{ color: '#696767' }}>Không có quy trình nào</small>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  const { taskProcess, tasks, department } = state
  return { taskProcess, tasks, department }
}
const actionCreators = {
  getAllTaskProcess: TaskProcessActions.getAllTaskProcess
}

export default connect(mapState, actionCreators)(withTranslate(GeneralTaskProcessChart))
