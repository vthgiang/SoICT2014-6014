import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { GeneralTab } from './generalTab'
import { LogActivityTab } from './logActivityTab'

import { DialogModal, ShowMoreShowLess, DateTimeConverter } from '../../../../common-components'
import { htmlToText } from 'html-to-text'
import Swal from 'sweetalert2'
import parse from 'html-react-parser'
import moment from 'moment'
import 'moment/locale/vi'

const DelegationDetailInfoTask = (props) => {
  const [state, setState] = useState({
    showEvaluations: []
  })

  const { translate, delegation } = props
  const { delegationID, delegateTask, showEvaluations, delegatee } = state

  // Nhận giá trị từ component cha
  useEffect(() => {
    if (
      props.delegationID !== state.delegationID ||
      props.status !== state.status ||
      props.replyStatus !== state.replyStatus ||
      props.logs !== state.logs ||
      props.delegateTask !== state.delegateTask
    ) {
      setState({
        ...state,
        delegationID: props.delegationID,
        delegationName: props.delegationName,
        description: props.description,
        delegator: props.delegator,
        delegatee: props.delegatee,
        delegatePrivileges: props.delegatePrivileges,
        delegateType: props.delegateType,
        delegateRole: props.delegateRole,
        delegateTask: props.delegateTask,
        delegateTaskRoles: props.delegateTaskRoles,
        status: props.status,
        allPrivileges: props.allPrivileges,
        startDate: props.startDate,
        endDate: props.endDate,
        revokedDate: props.revokedDate,
        revokeReason: props.revokeReason,
        forReceive: props.forReceive,
        replyStatus: props.replyStatus,
        declineReason: props.declineReason,
        delegatePolicy: props.delegatePolicy,
        logs: props.logs
      })
    }
  }, [props.delegationID, props.status, props.replyStatus, props.delegateTask, props.delegateTask])

  console.log(state)
  const showDetailTimer = (nameAction, timeSheetLogs) => {
    nameAction = htmlToText(nameAction)
    let result = []
    timeSheetLogs.reduce((res, value) => {
      const creatorId = getCreatorId(value?.creator)

      if (!res[creatorId]) {
        res[creatorId] = { id: creatorId, duration: 0, creatorName: value.creator.name }
        result.push(res[creatorId])
      }
      res[creatorId].duration += value.duration
      return res
    }, {})

    Swal.fire({
      html:
        `<div style="max-width: 100%; max-height: 100%" > 
                <h4 style="margin-bottom: 15px">Thời gian bấm giờ cho hoạt động "<strong>${nameAction}</strong>"</h4>` +
        `<ol>${result.map((o) => `<li style="margin-bottom: 7px">${o.creatorName}: ${convertTime(o.duration)}</li>`).join(' ')} </ol>` +
        `<div>`,

      confirmButtonText: `Đồng ý`
    })
  }

  const handleShowTime = (timeSheetLog) => {
    if (timeSheetLog && timeSheetLog.length > 0) {
      timeSheetLog = timeSheetLog.filter((x) => x.acceptLog === true)
      const totalDuration = timeSheetLog.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.duration
      }, 0)
      return convertTime(totalDuration)
    } else {
      return
    }
  }

  const getCreatorId = (creator) => {
    if (!creator) return
    if (creator && typeof creator === 'object') return creator._id
    else return creator
  }

  const convertTime = (ms) => {
    if (!ms) return '00:00:00'
    let hour = Math.floor(ms / (60 * 60 * 1000))
    let minute = Math.floor((ms - hour * 60 * 60 * 1000) / (60 * 1000))
    let second = Math.floor((ms - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000)

    return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`
  }

  const handleShowEvaluations = (id) => {
    let a
    let { showEvaluations } = state
    if (showEvaluations.some((obj) => obj === id)) {
      a = showEvaluations.filter((x) => x !== id)
      setState({
        ...state,
        showEvaluations: a
      })
    } else {
      setState({
        ...state,
        showEvaluations: [...state.showEvaluations, id]
      })
    }
  }

  const getRoleNameInTask = (value) => {
    let { translate } = props
    switch (value) {
      case 'responsible':
        return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.responsible')} ]</span>
      case 'accountable':
        return (
          <span style={{ fontSize: 10 }} className='text-green'>
            [ {translate('task.task_management.accountable')} ]
          </span>
        )
      case 'consulted':
        return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.consulted')} ]</span>
      case 'informed':
        return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.informed')} ]</span>
      case 'creator':
        return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.creator')} ]</span>
      default:
        return ''
    }
  }

  const getTaskActions = (taskActions) => {
    let { delegateTaskRoles } = state

    let taskActionsFilter = []
    taskActionsFilter = delegateTaskRoles.includes('responsible')
      ? delegateTaskRoles.length == 1
        ? taskActions.filter((a) => a.creator._id == delegatee._id)
        : taskActions.filter((a) => a.creator._id == delegatee._id || a.evaluations.map((e) => e.creator._id).includes(delegatee._id))
      : taskActions.filter((a) => a.evaluations.map((e) => e.creator._id).includes(delegatee._id))

    return taskActionsFilter
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-detail-info-delegation-hooks-Task`}
        isLoading={delegation.isLoading}
        title={translate('manage_delegation.detail_info_delegation_task')}
        formID={`form-detail-delegation-hooks-Task`}
        size={props.size ? props.size : 50}
        hasSaveButton={false}
        hasNote={false}
      >
        <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
          {/* Nav-tabs */}
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a title={translate('manage_delegation.general_information')} data-toggle='tab' href={`#detail_general_information_task`}>
                {translate('manage_delegation.general_information')}
              </a>
            </li>
            <li>
              <a title={translate('manage_delegation.log_activity')} data-toggle='tab' href={`#detail_log_activity_task`}>
                {translate('manage_delegation.log_activity')}
              </a>
            </li>
            <li>
              <a title={translate('manage_delegation.log_activity_task')} data-toggle='tab' href={`#detail_log_activity_task_actions`}>
                {translate('manage_delegation.log_activity_task')}
              </a>
            </li>
            <li>
              <a title={translate('manage_delegation.log_timesheet_task')} data-toggle='tab' href={`#detail_log_activity_task_timesheet`}>
                {translate('manage_delegation.log_timesheet_task')}
              </a>
            </li>
            <li>
              <a title={translate('manage_delegation.log_history_tab')} data-toggle='tab' href={`#detail_log_activity_task_history`}>
                {translate('manage_delegation.log_history_task')}
              </a>
            </li>
          </ul>

          <div className='tab-content'>
            {/* Thông tin chung */}
            <GeneralTab
              id={`detail_general_information_task`}
              delegationID={delegationID}
              delegationName={state.delegationName}
              description={state.description}
              delegator={state.delegator}
              delegatee={state.delegatee}
              delegatePrivileges={state.delegatePrivileges}
              delegateType={state.delegateType}
              delegateRole={state.delegateRole}
              delegateTask={state.delegateTask}
              delegateTaskRoles={state.delegateTaskRoles}
              status={state.status}
              allPrivileges={state.allPrivileges}
              startDate={state.startDate}
              endDate={state.endDate}
              revokedDate={state.revokedDate}
              revokeReason={state.revokeReason}
              forReceive={state.forReceive}
              replyStatus={state.replyStatus}
              declineReason={state.declineReason}
              delegatePolicy={state.delegatePolicy}
              logs={state.logs}
            />

            {/* Thông tin thuộc tính subject */}
            <LogActivityTab
              id={`detail_log_activity_task`}
              delegationID={delegationID}
              delegationName={state.delegationName}
              description={state.description}
              delegator={state.delegator}
              delegatee={state.delegatee}
              delegatePrivileges={state.delegatePrivileges}
              delegateType={state.delegateType}
              delegateRole={state.delegateRole}
              delegateTask={state.delegateTask}
              status={state.status}
              allPrivileges={state.allPrivileges}
              startDate={state.startDate}
              endDate={state.endDate}
              revokedDate={state.revokedDate}
              revokeReason={state.revokeReason}
              logs={state.logs}
            />

            <div id={`detail_log_activity_task_actions`} className='tab-pane'>
              {delegateTask && getTaskActions(delegateTask.taskActions).length > 0 ? (
                <ShowMoreShowLess
                  id={`detail_log_activity_${delegationID}_actions`}
                  classShowMoreLess='tool-level1'
                  styleShowMoreLess={{ display: 'inline-block', marginBotton: 15 }}
                >
                  {getTaskActions(delegateTask.taskActions).map((item, index) => (
                    <div key={item._id} className={index > 3 ? 'hide-component' : ''}>
                      {item.creator ? (
                        <img className='user-img-level1' src={process.env.REACT_APP_SERVER + item.creator.avatar} alt='User Image' />
                      ) : (
                        <div className='user-img-level1' />
                      )}

                      <div className='content-level1' data-width='100%'>
                        {/* Tên người tạo hoạt động */}
                        <div style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'space-between' }}>
                          {item.creator && <a style={{ cursor: 'pointer' }}>{item.creator?.name} </a>}
                          {item.creator && (
                            <a
                              className='pull-right'
                              style={{ cursor: 'pointer' }}
                              onClick={() => showDetailTimer(item.description, item.timesheetLogs)}
                            >
                              {handleShowTime(item.timesheetLogs)}
                            </a>
                          )}
                        </div>
                        <div>
                          {item.name && <b style={{ display: 'flex', marginTop: '4px' }}>{item.name} </b>}
                          {item?.description?.split('\n')?.map((item, idx) => (
                            <div key={idx}>{parse(item)}</div>
                          ))}
                        </div>
                      </div>

                      <ul className='list-inline tool-level1'>
                        <li>
                          <span className='text-sm'>{<DateTimeConverter dateTime={item.createdAt} />}</span>
                        </li>
                        {item.creator && (
                          <React.Fragment>
                            {item.evaluations && (
                              <li>
                                <a
                                  style={{ cursor: 'pointer', pointerEvents: item.evaluations.length > 0 ? '' : 'none' }}
                                  className='link-black text-sm show-evaluation'
                                  onClick={() => {
                                    handleShowEvaluations(item._id)
                                  }}
                                >
                                  <i className='fa fa-thumbs-o-up margin-r-5'></i>
                                  {translate('task.task_perform.evaluation')} ({item.evaluations && item.evaluations.length})
                                </a>
                              </li>
                            )}
                          </React.Fragment>
                        )}
                      </ul>

                      <div className='tool-level1' style={{ paddingLeft: 5 }}>
                        {/* Các kết quả đánh giá của action */}
                        {showEvaluations.some((obj) => obj === item._id) && (
                          <div style={{ marginBottom: '10px' }}>
                            <ul className='list-inline'>
                              <li>
                                {Array.isArray(item?.evaluations) &&
                                  item.evaluations.map((element, index) => {
                                    return (
                                      <div key={index}>
                                        <b> {element?.creator?.name} </b>
                                        {getRoleNameInTask(element?.role)}
                                        <span>
                                          {' '}
                                          {translate('task.task_management.evaluation_score')}:
                                          <span className='text-red'> {element?.rating}/10</span> -{' '}
                                          {translate('kpi.evaluation.employee_evaluation.importance_level')}:
                                          <span className='text-red'> {element?.actionImportanceLevel}/10</span>
                                        </span>
                                        &ensp;
                                      </div>
                                    )
                                  })}
                              </li>
                            </ul>
                            {Array.isArray(item?.evaluations) &&
                              item?.evaluations?.filter((element) => element.role === 'accountable').length > 0 && (
                                <p>
                                  <b>{translate('task.task_management.average_score')} :</b>
                                  <span>
                                    {' '}
                                    {translate('task.task_management.evaluation_score')}:
                                    <span className='text-red'> {item?.rating}/10</span> -{' '}
                                    {translate('kpi.evaluation.employee_evaluation.importance_level')}:
                                    <span className='text-red'> {item?.actionImportanceLevel}/10</span>
                                  </span>
                                </p>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ShowMoreShowLess>
              ) : (
                <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>

            <div id={`detail_log_activity_task_timesheet`} className='tab-pane'>
              {delegateTask && delegateTask.timesheetLogs.filter((a) => a.creator._id == delegatee._id).length > 0 ? (
                <ShowMoreShowLess
                  id={`detail_log_activity_${delegationID}_timesheet`}
                  styleShowMoreLess={{ display: 'inline-block', marginBotton: 15 }}
                >
                  {delegateTask.timesheetLogs
                    .filter((a) => a.creator._id == delegatee._id)
                    .map((item, index) => (
                      <React.Fragment key={index}>
                        {item.stoppedAt && (
                          <div key={item._id} className={`item-box ${index > 3 ? 'hide-component' : ''}`}>
                            <h3 className={`pull-right ${item.acceptLog ? 'text-green' : 'text-red'}`}>{convertTime(item.duration)}</h3>
                            <a style={{ fontWeight: 700, cursor: 'pointer' }}>{item.creator?.name} </a>
                            <div>
                              <i className='fa fa-clock-o'> </i> {moment(item.startedAt).format('DD/MM/YYYY HH:mm:ss')}
                              {' - '}
                              <i className='fa fa-clock-o'> </i> {moment(item.stoppedAt).format('DD/MM/YYYY HH:mm:ss')})
                            </div>
                            <div>
                              <i
                                style={{ marginRight: '5px' }}
                                className={`${item.autoStopped === 1 ? 'text-green fa fa-hand-pointer-o' : item.autoStopped === 2 ? 'text-red fa fa-clock-o' : 'text-red fa fa-plus'}`}
                              >
                                {item.autoStopped === 1 ? 'Bấm giờ' : item.autoStopped === 2 ? 'Bấm hẹn giờ' : 'Bấm bù giờ'}
                              </i>

                              <i className={`${item.acceptLog ? 'text-green fa fa-check' : 'text-red fa fa-close'}`}>
                                {' '}
                                {item.acceptLog ? 'Được chấp nhận' : 'Không được chấp nhận'}
                              </i>
                            </div>
                            <div>
                              <i className='fa fa-edit'></i>
                              {item.description ? item.description : translate('task.task_perform.none_description')}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                </ShowMoreShowLess>
              ) : (
                <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>

            <div id={`detail_log_activity_task_history`} className='tab-pane'>
              {delegateTask && delegateTask.logs.filter((a) => a.creator._id == delegatee._id).length > 0 ? (
                <ShowMoreShowLess
                  id={`detail_log_activity_${delegationID}_history`}
                  classShowMoreLess='tool-level1'
                  styleShowMoreLess={{ display: 'inline-block', marginBotton: 15 }}
                >
                  {delegateTask.logs
                    .filter((a) => a.creator._id == delegatee._id)
                    .map((item, index) => (
                      <React.Fragment key={index}>
                        {item.createdAt && (
                          <div key={item._id} className={`item-box ${index > 3 ? 'hide-component' : ''}`}>
                            <a style={{ fontWeight: 700, cursor: 'pointer' }}>{item.creator?.name} </a>
                            {item.title ? item.title : translate('task.task_perform.none_description')}&nbsp; (
                            {moment(item.createdAt).format('HH:mm:ss DD/MM/YYYY')})
                            <div>{item.description ? parse(item.description) : translate('task.task_perform.none_description')}</div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                </ShowMoreShowLess>
              ) : (
                <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>
          </div>
        </div>
        {/* <form id={`form-detail-delegation-hooks`}>
                    <div className={`form-group`}>
                        <label>{translate('manage_delegation.delegationName')}:</label>
                        <span> {delegationName}</span>
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('manage_delegation.description')}:</label>
                        <span> {description}</span>
                    </div>
                </form> */}
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const delegation = state.delegation
  return { delegation }
}

const connectedDelegationDetailInfoTask = React.memo(connect(mapStateToProps, null)(withTranslate(DelegationDetailInfoTask)))
export { connectedDelegationDetailInfoTask as DelegationDetailInfoTask }
