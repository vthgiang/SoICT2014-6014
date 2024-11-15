import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { getStorage } from '../../../../../config'
import { DialogModal } from '../../../../../common-components'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { TaskProcessActions } from '../../redux/actions'
import { ModalViewTaskProcess2 } from './modalViewTaskProcess2'

const zlevel = 1
function areEqual(prevProps, nextProps) {
  if (prevProps.idProcess === nextProps.idProcess) {
    return true
  }
  return false
}
function ModalViewTaskProcess(props) {
  const { data } = props
  const [state, setState] = useState({
    userId: getStorage('userId'),
    currentRole: getStorage('currentRole'),
    showInfo: false,
    showInfoProcess: false,
    selectedView: 'info',
    info: data.tasks,
    xmlDiagram: data.xmlDiagram,
    dataProcessTask: '',
    showProcessTemplate: false,
    render: 0
  })
  const { translate, role, user } = props
  return (
    <DialogModal
      size='100'
      modalID='modal-view-process-task'
      isLoading={false}
      formID='form-task-process'
      title={props.title}
      hasSaveButton={false}
      bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <ModalViewTaskProcess2
        title={translate('task.task_process.view_process_template_modal')}
        listOrganizationalUnit={props.listOrganizationalUnit}
        data={props.data}
        idProcess={props.idProcess}
        xmlDiagram={props.xmlDiagram}
        processName={props.processName}
        processDescription={props.processDescription}
        infoTask={props.infoTask}
        creator={props.creator}
      />
    </DialogModal>
  )
}

function mapState(state) {
  const { user, auth, role } = state
  return { user, auth, role }
}

const actionCreators = {
  getDepartment: UserActions.getDepartmentOfUser,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  createXmlDiagram: TaskProcessActions.createXmlDiagram,
  getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
  editXmlDiagram: TaskProcessActions.editXmlDiagram,
  getAllUsers: UserActions.get
}
const connectedModalAddProcess = connect(mapState, actionCreators)(withTranslate(React.memo(ModalViewTaskProcess, areEqual)))
export { connectedModalAddProcess as ModalViewTaskProcess }
