import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import TaskComponent from './taskComponent'

function ModalPerform(props) {
  const { performtasks, units, taskName } = props

  return (
    <React.Fragment>
      <DialogModal
        size='100'
        modalID={`modelPerformTask${props.id}`}
        formID='form-perform-task'
        title={performtasks?.task?.name ? performtasks.task.name : taskName}
        bodyStyle={{ padding: '0px' }}
        hasSaveButton={false}
      >
        <TaskComponent units={units} id={props.id} />
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { performtasks } = state
  return { performtasks }
}

const actionDispatch = {}

const modalPerform = connect(mapState, actionDispatch)(withTranslate(ModalPerform))
export { modalPerform as ModalPerform }
