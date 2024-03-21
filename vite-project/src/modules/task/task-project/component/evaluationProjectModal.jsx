import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components/index'
import { EvaluateByResponsibleEmployeeProject } from './evaluateByResponsibleEmployeeProject'
import { EvaluateByAccountableEmployeeProject } from './evaluateByAccountableEmployeeProject'
import { EvaluateByConsultedEmployee } from '../../task-perform/component/evaluateByConsultedEmployee'
import Swal from 'sweetalert2'

const EvaluationProjectModal = (props) => {
  const { translate, role, id, performtasks, hasAccountable } = props

  let title
  if (role === 'responsible') {
    title = translate('task.task_management.detail_resp_eval')
  } else if (role === 'accountable') {
    title = translate('task.task_management.detail_acc_eval')
  } else if (role === 'consulted') {
    title = translate('task.task_management.detail_cons_eval')
  }

  let task
  if (performtasks.task) {
    task = performtasks.task
  }

  return (
    <DialogModal modalID={`task-project-evaluation-modal-${id}-`} title={title} hasSaveButton={false} size={100}>
      <div className='col-md-12 qlcv'>{role === 'responsible' && <EvaluateByResponsibleEmployeeProject role={role} task={task} />}</div>
    </DialogModal>
  )
}

const mapState = (state) => {
  const { performtasks } = state
  return { performtasks }
}

const actionCreators = {}

const connectedEvaluationModal = connect(mapState, actionCreators)(withTranslate(EvaluationProjectModal))
export { connectedEvaluationModal as EvaluationProjectModal }
