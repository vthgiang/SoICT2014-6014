import React, { Component, Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { taskManagementActions } from '../../task-management/redux/actions'

import { DatePicker } from '../../../../common-components'
import dayjs from 'dayjs'

import { convertTime } from '../../../../helpers/stringMethod'
import { getStorage } from '../../../../config'
import parse from 'html-react-parser'
function PersonalTimeSheetLog(props) {
  const { tasks, translate } = props
  console.log('props: ', props)

  const [state, setState] = useState(initState())
  function initState() {
    let d = new Date(),
      month = d.getMonth() + 1,
      year = d.getFullYear()
    let endMonth

    if (month < 10) {
      endMonth = '0' + month
    } else {
      endMonth = month
    }

    const INFO_SEARCH = {
      endMonthTitle: [endMonth, year].join('-')
    }

    return {
      type: 'status',
      monthTimeSheetLog: INFO_SEARCH.endMonthTitle
    }
  }

  const { monthTimeSheetLog } = state

  useEffect(() => {
    let d = new Date(),
      month = d.getMonth() + 1,
      year = d.getFullYear(),
      requireActions = true
    props.getTimeSheetOfUser(getStorage('userId'), month, year, requireActions)
  }, [])

  const handleChangeMonthTimeSheetLog = (value) => {
    setState({
      ...state,
      monthTimeSheetLog: value
    })
  }

  const getUserTimeSheetLogs = () => {
    let { monthTimeSheetLog } = state
    if (monthTimeSheetLog) {
      let d = monthTimeSheetLog.split('-')
      let month = d[0]
      let year = d[1]
      let userId = getStorage('userId')
      let requireActions = true
      props.getTimeSheetOfUser(userId, month, year, requireActions)
    }
  }

  const getTotalTimeSheet = (ts) => {
    // Tính tổng thời gian bấm giờ trong tháng
    console.log('ts', ts)
    let total = 0
    for (let task of ts) {
      for (let action of task.taskActions) {
        for (let tsl of action.timesheetLogs) {
          if (tsl.acceptLog) total += tsl.duration
        }
      }
    }
    return convertTime(total)
  }

  // Tìm tổng thời gian bấm giờ của bấm giờ
  // type= 1: tắt bấm giờ bằng tay, 2: bấm hẹn giờ, 3: bấm bù giờ
  const getTotalTimeSheetByType = (task, type) => {
    let total = 0
    for (let action of task.taskActions) {
      for (let tsl of action.timesheetLogs) {
        if (tsl.acceptLog && tsl.autoStopped === type) total += tsl.duration
      }
    }
    return convertTime(total)
  }

  let { userTimeSheetLogs } = tasks // Thống kê bấm giờ

  return (
    <React.Fragment>
      {/* Thống kê bấm giờ theo tháng */}
      <div className='row'>
        <div className='col-xs-12 col-md-12'>
          <div className='box box-primary'>
            <div className='box-body qlcv'>
              {/* Seach theo thời gian */}
              <div className='form-inline'>
                <div className='form-group'>
                  <label style={{ width: 'auto' }}>Tháng</label>
                  <DatePicker
                    id='month-time-sheet-log'
                    dateFormat='month-year'
                    value={monthTimeSheetLog}
                    onChange={handleChangeMonthTimeSheetLog}
                    disabled={false}
                  />
                </div>
                <button className='btn btn-primary' onClick={getUserTimeSheetLogs}>
                  Thống kê
                </button>
              </div>

              <div>
                <p className='pull-right' style={{ fontWeight: 'bold' }}>
                  Tổng thời gian
                  <span style={{ fontWeight: 'bold', marginLeft: 10 }}>
                    {!tasks.isLoading ? getTotalTimeSheet(userTimeSheetLogs) : translate('general.loading')}
                  </span>
                </p>
              </div>
              <table className='table table-hover table-striped table-bordered' id='table-user-timesheetlogs'>
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>STT</th>
                    <th style={{ width: 130 }}>Tên công việc</th>
                    <th>Hoạt động</th>
                    <th style={{ width: 130, textAlign: 'center' }}>Bấm giờ</th>
                    <th style={{ width: 130, textAlign: 'center' }}>Bấm hẹn giờ</th>
                    <th style={{ width: 130, textAlign: 'center' }} className='col-sort'>
                      Bấm bù giờ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userTimeSheetLogs.map((task, taskIndex) => {
                    return (
                      <>
                        <tr key={taskIndex}>
                          <td rowSpan={task.taskActions.length + 2}>{taskIndex + 1}</td>
                          <td rowSpan={task.taskActions.length + 2} style={{ color: '#0c5c8a', fontWeight: 'bold' }}>
                            {task.name}
                          </td>
                        </tr>
                        {task.taskActions.map((action, actionIndex) => {
                          let sum = [0, 0, 0, 0]
                          for (let tsl of action.timesheetLogs) {
                            if (tsl.acceptLog) sum[tsl.autoStopped] += tsl.duration
                            console.log('sum', sum)
                          }
                          return (
                            <tr key={actionIndex}>
                              <td>{parse(action.description)}</td>
                              <td style={{ textAlign: 'center' }}>{convertTime(sum[1])}</td>
                              <td style={{ textAlign: 'center' }}>{convertTime(sum[2])}</td>
                              <td style={{ textAlign: 'center' }}>{convertTime(sum[3])}</td>
                            </tr>
                          )
                        })}
                        {
                          <tr>
                            <td style={{ textAlign: 'right', color: '#0c5c8a' }}>Tổng thời gian</td>
                            <td style={{ textAlign: 'center', color: '#0c5c8a' }}>{getTotalTimeSheetByType(task, 1)}</td>
                            <td style={{ textAlign: 'center', color: '#0c5c8a' }}>{getTotalTimeSheetByType(task, 2)}</td>
                            <td style={{ textAlign: 'center', color: '#0c5c8a' }}>{getTotalTimeSheetByType(task, 3)}</td>
                          </tr>
                        }
                        {<tr></tr>}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { tasks } = state
  return { tasks }
}
const actionCreators = {
  getTimeSheetOfUser: taskManagementActions.getTimeSheetOfUser
}

export default connect(mapState, actionCreators)(withTranslate(PersonalTimeSheetLog))
