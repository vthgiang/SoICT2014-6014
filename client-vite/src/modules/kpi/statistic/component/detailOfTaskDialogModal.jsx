import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal } from '../../../../common-components'

function DetailOfTaskDialogModal(props) {
  const { translate } = props
  const { listTask } = props

  function formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }

  const formatPriority = (data) => {
    const { translate } = props
    if (data === 1) return translate('task.task_management.low')
    if (data === 2) return translate('task.task_management.average')
    if (data === 3) return translate('task.task_management.standard')
    if (data === 4) return translate('task.task_management.high')
    if (data === 5) return translate('task.task_management.urgent')
  }

  const formatStatus = (data) => {
    const { translate } = props
    if (data === 'inprocess') return translate('task.task_management.inprocess')
    else if (data === 'wait_for_approval') return translate('task.task_management.wait_for_approval')
    else if (data === 'finished') return translate('task.task_management.finished')
    else if (data === 'delayed') return translate('task.task_management.delayed')
    else if (data === 'canceled') return translate('task.task_management.canceled')
  }

  return (
    <React.Fragment>
      <DialogModal modalID='modal-task-detail' title={translate('menu.task')} size='75' hasNote={false} hasSaveButton={false}>
        <table className='table table-bordered table-striped table-hover'>
          <thead>
            <tr>
              <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')} style={{ width: '40px' }}>
                {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}
              </th>
              <th title={translate('task.task_management.col_name')}>{translate('task.task_management.col_name')}</th>
              <th title={translate('task.task_management.col_organization')}>{translate('task.task_management.col_organization')}</th>
              <th title={translate('task.task_management.col_priority')}>{translate('task.task_management.col_priority')}</th>
              <th title={translate('task.task_management.col_start_date')}>{translate('task.task_management.col_start_date')}</th>
              <th title={translate('task.task_management.col_end_date')}>{translate('task.task_management.col_end_date')}</th>
              <th title={translate('task.task_management.col_status')} style={{ textAlign: 'left' }}>
                {translate('task.task_management.col_status')}
              </th>
            </tr>
          </thead>

          <tbody>
            {listTask && listTask.length !== 0 ? (
              listTask.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td title={task.name}>
                    <a href={`/task?taskId=${task._id}`} target='_blank'>
                      {task.name}
                    </a>
                  </td>
                  <td
                    title={
                      task.detailOrganizationalUnit && task.detailOrganizationalUnit.length !== 0
                        ? task.detailOrganizationalUnit[0].name
                        : null
                    }
                  >
                    {task.detailOrganizationalUnit && task.detailOrganizationalUnit.length !== 0
                      ? task.detailOrganizationalUnit[0].name
                      : null}
                  </td>
                  <td title={task.priority}>{formatPriority(task.priority)}</td>
                  <td title={task.startDate}>{formatDate(task.startDate)}</td>
                  <td title={task.endDate}>{formatDate(task.endDate)}</td>
                  <td title={task.status} style={{ textAlign: 'left' }}>
                    {formatStatus(task.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='7'>{translate('kpi.organizational_unit.kpi_organizational_unit_manager.no_data')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const {} = state
  return {}
}

const actions = {}

const connectDetailOfTaskDialogModal = connect(mapState, actions)(withTranslate(DetailOfTaskDialogModal))
export { connectDetailOfTaskDialogModal as DetailOfTaskDialogModal }
