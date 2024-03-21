import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'

import { DialogModal } from '../../../../common-components'
import { convertTime } from '../../../../helpers/stringMethod'

const InforTimeSheetLog = (props) => {
  const convertType = (value) => {
    // 1: Tắt bấm giờ bằng tay, 2: Tắt bấm giờ tự động với thời gian hẹn trc, 3: add log timer
    if (value == 1) {
      return 'Bấm giờ'
    } else if (value == 2) {
      return 'Bấm hẹn giờ'
    } else {
      return 'Bấm bù giờ'
    }
  }

  const { translate } = props
  const { timesheetlogs, filterTimeSheetLogs } = props

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-infor-time-sheet-log'
        formID='modal-infor-time-sheet-log'
        title={`${translate('task.task_management.timesheet_statistics')} ${timesheetlogs.name}`}
        hasSaveButton={false}
        hasNote={false}
      >
        <div className='description-box'>
          <div>
            <strong>{translate('task.task_perform.total_time')}</strong>
            {convertTime(timesheetlogs.totalhours)}
          </div>
          <div>
            <strong>{translate('task.task_management.timer')}:</strong> {convertTime(timesheetlogs.manualtimer)}
          </div>
          <div>
            <strong>{translate('task.task_management.additional_timer')}:</strong> {convertTime(timesheetlogs.logtimer)}
          </div>
          <div>
            <strong>{translate('task.task_management.interval_timer')}:</strong> {convertTime(timesheetlogs.autotimer)}
          </div>
        </div>
        <div id={`modal-infor-time-sheet-log`}>
          <table className='table table-hover table-striped table-bordered' id='info-user-timesheetlogs'>
            <thead>
              <tr>
                <th className='col-fixed' style={{ width: 80 }}>
                  {translate('general.index')}
                </th>
                <th>{translate('task.task_management.name')}</th>
                <th>{translate('task.task_management.start_time')}</th>
                <th>{translate('task.task_management.end_time')}</th>
                <th>{translate('task.task_management.timer_type')}</th>
                <th>{translate('task.task_management.timer')}</th>
              </tr>
            </thead>
            <tbody>
              {filterTimeSheetLogs && filterTimeSheetLogs.length
                ? filterTimeSheetLogs.map((tsl, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <a href={`/task?taskId=${tsl.taskId}`} target='_blank'>
                            {tsl.taskName}
                          </a>
                        </td>
                        <td>{moment(tsl.startedAt).format('HH:mm:ss DD/MM/YYYY')}</td>
                        <td>{moment(tsl.stoppedAt).format('HH:mm:ss DD/MM/YYYY')}</td>
                        <td>{convertType(tsl.autoStopped)}</td>
                        <td>{convertTime(tsl.duration)}</td>
                      </tr>
                    )
                  })
                : translate('general.no_data')}
            </tbody>
          </table>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

const inforTimeSheetLog = connect(null, null)(withTranslate(InforTimeSheetLog))
export { inforTimeSheetLog as InforTimeSheetLog }
