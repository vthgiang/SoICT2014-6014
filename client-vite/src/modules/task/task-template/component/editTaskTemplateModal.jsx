import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { taskTemplateActions } from '../redux/actions'
import { EditTaskTemplate } from './editTaskTemplate'
import { DialogModal } from '../../../../common-components'

function ModalEditTaskTemplate(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    editingTemplate: {
      organizationalUnit: '',
      collaboratedWithOrganizationalUnits: [],
      name: '',
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      description: '',
      formula: '',
      priority: 3,
      taskActions: [],
      taskInformations: []
    }
  })

  useEffect(() => {
    if (props.taskTemplateId !== state.taskTemplateId) {
      setState((state) => {
        return {
          ...state,
          taskTemplateId: props.taskTemplateId,
          taskTemplate: props.taskTemplate,
          editingTemplate: {
            _id: props.taskTemplate._id,
            organizationalUnit: props.taskTemplate.organizationalUnit._id,
            collaboratedWithOrganizationalUnits: props.taskTemplate.collaboratedWithOrganizationalUnits.map((item) => {
              if (item) return item._id
            }),
            name: props.taskTemplate.name,
            readByEmployees: props.taskTemplate.readByEmployees.map((item) => item.id),
            responsibleEmployees: props.taskTemplate.responsibleEmployees.map((item) => item.id),
            accountableEmployees: props.taskTemplate.accountableEmployees.map((item) => item.id),
            consultedEmployees: props.taskTemplate.consultedEmployees.map((item) => item.id),
            informedEmployees: props.taskTemplate.informedEmployees.map((item) => item.id),
            description: props.taskTemplate.description,
            formula: props.taskTemplate.formula,
            priority: props.taskTemplate.priority,
            taskActions: props.taskTemplate.taskActions,
            taskInformations: props.taskTemplate.taskInformations,
            isMappingTask: props.taskTemplate.isMappingTask,
            listMappingTask: props.taskTemplate.listMappingTask
          },
          showActionForm: true
        }
      })
    }
  }, [props.taskTemplateId, props.taskTemplate])

  const handleSubmit = () => {
    const { editingTemplate } = state
    props.editTaskTemplate(editingTemplate._id, editingTemplate)
  }

  const onChangeTemplateData = (value) => {
    setState({
      ...state,
      editingTemplate: value
    })
  }

  const { user, translate } = props
  const { editingTemplate, taskTemplateId } = state

  return (
    <DialogModal
      modalID='modal-edit-task-template'
      isLoading={user.isLoading}
      formID='form-edit-task-template'
      title={translate('task_template.edit_tasktemplate')}
      func={handleSubmit}
      // disableSubmit={!isTaskTemplateFormValidated()}
      size={100}
    >
      <EditTaskTemplate
        isTaskTemplate
        taskTemplate={editingTemplate}
        taskTemplateId={taskTemplateId}
        onChangeTemplateData={onChangeTemplateData}
      />
    </DialogModal>
  )
}

function mapState(state) {
  const { department, user, tasktemplates } = state
  return { department, user, tasktemplates }
}

const actionCreators = {
  editTaskTemplate: taskTemplateActions.editTaskTemplate
}
const connectedModalEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalEditTaskTemplate))
export { connectedModalEditTaskTemplate as ModalEditTaskTemplate }
