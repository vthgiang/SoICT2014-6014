import React, { useEffect, useState } from 'react'
import { useTranslate } from 'react-redux-multilingual'
import { useDispatch, useSelector } from 'react-redux'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { DialogModal } from '../../../../common-components'
import { AddTaskTemplate } from './addTaskTemplate'
import { taskTemplateActions } from '../redux/actions'

function ModalAddTaskTemplate({ savedTaskAsTemplate, savedTaskItem, savedTaskId }) {
  const [state, setState] = useState({
    newTemplate: {
      organizationalUnit: '',
      collaboratedWithOrganizationalUnits: [],
      name: '',
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      description: '',
      creator: '',
      formula: '',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      isMappingTask: false,
      listMappingTask: []
    },
    currentRole: localStorage.getItem('currentRole')
  })
  const dispatch = useDispatch()
  const translate = useTranslate()

  const { user } = useSelector((stateSelector) => ({
    user: stateSelector.user
  }))

  useEffect(() => {
    dispatch(UserActions.getDepartmentOfUser())
    dispatch(UserActions.getAllUserOfCompany())
    dispatch(UserActions.getRoleSameDepartment(localStorage.getItem('currentRole')))
    dispatch(DepartmentActions.getDepartmentsThatUserIsManager())
    dispatch(UserActions.getAllUserInAllUnitsOfCompany())
  }, [dispatch])

  /** Submit new template in data */
  const handleSubmit = async () => {
    const { newTemplate } = state
    dispatch(taskTemplateActions.addTaskTemplate(newTemplate))
  }

  const onChangeTemplateData = (newValues) => {
    setState((prevState) => ({
      ...prevState,
      newTemplate: {
        ...prevState.newTemplate,
        ...newValues
      }
    }))
  }

  const onChangeListMappingTask = (listMappingTask) => {
    setState((prevState) => ({
      ...prevState,
      newTemplate: {
        ...prevState.newTemplate,
        listMappingTask
      }
    }))
  }

  const onChangeIsMappingTask = (isMappingTask) => {
    setState((prevState) => ({
      ...prevState,
      newTemplate: {
        ...prevState.newTemplate,
        isMappingTask
      }
    }))
  }

  return (
    <DialogModal
      modalID={`modal-add-task-template-${savedTaskId}`}
      isLoading={user.isLoading}
      formID={`form-add-task-template-${savedTaskId}`}
      title={translate('task_template.add_tasktemplate')}
      func={handleSubmit}
      size={100}
    >
      <AddTaskTemplate
        onChangeTemplateData={onChangeTemplateData}
        onChangeListMappingTask={onChangeListMappingTask}
        onChangeIsMappingTask={onChangeIsMappingTask}
        // dùng cho chức năng lưu task thành template
        savedTaskAsTemplate={savedTaskAsTemplate}
        savedTaskItem={savedTaskItem}
        savedTaskId={savedTaskId}
        // end
      />
    </DialogModal>
  )
}

export default ModalAddTaskTemplate
