import { DialogModal } from '../../../../../common-components/src/modal/dialogModal'
import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

function TaskImpartanceDialog(props) {
  const [state, setState] = useState({})

  const { translate, task } = props
  let priority = ''
  if (task.priority) {
    switch (task.priority) {
      case 1:
        priority = translate('task.task_management.low')
        break
      case 2:
        priority = translate('task.task_management.average')
        break
      case 3:
        priority = translate('task.task_management.standard')
        break
      case 4:
        priority = translate('task.task_management.high')
        break
      case 5:
        priority = translate('task.task_management.urgent')
        break
    }
  }
  return (
    <React.Fragment>
      <DialogModal
        size={50}
        modalID={`modal-taskimportance-auto`}
        title={`${translate('kpi.evaluation.employee_evaluation.explain_automatic_point')} ${props.task.name}`}
        hasSaveButton={false}
      >
        <div>
          <div>
            <b>{translate('kpi.evaluation.employee_evaluation.formula')} :</b>
          </div>
          <div>3 * ( priority/5) + 3* (% contribution/100) + 4 * (day/30)</div>
          <div>{translate('task.task_management.calc_where')}:</div>
          <ul>
            <li>
              {' '}
              priority: {translate('kpi.evaluation.employee_evaluation.priority')}, 1: {translate('task.task_management.low')}, 2:{' '}
              {translate('task.task_management.average')}, 3: {translate('task.task_management.standard')}, 4:{' '}
              {translate('task.task_management.high')}, 5: {translate('task.task_management.urgent')}{' '}
            </li>
            <li> contribution: % {translate('kpi.evaluation.employee_evaluation.contribution')}</li>
            <li> day: {translate('kpi.evaluation.employee_evaluation.num_of_working_day')}</li>
            <li> 3, 3,4: {translate('task.task_management.coefficient')}</li>
          </ul>
          <div>
            <b>{translate('task.task_management.calc_new_formula')}:</b>
          </div>
          <div>
            {' '}
            3 * ({props.task.priority} / 5) + 3 * ({props.task.results.contribution} / 100) + 4 * ({props.task.daykpi} / 30)
          </div>
          <div> = {props.task.taskImportanceLevelCal}</div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

const taskImportance = connect(null, null)(withTranslate(TaskImpartanceDialog))
export { taskImportance as TaskDialog }
