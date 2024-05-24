import { useTranslate } from 'react-redux-multilingual/lib/context'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { DialogModal } from '../../../../../common-components'
import AddTaskPackageModelContent from './addTaskPackageModelContent'
import { TaskPackageManagementAction } from '../redux/actions'

function AddTaskComponent() {
  const translate = useTranslate()
  const [payload, setPayload] = useState({})
  const dispatch = useDispatch()

  const handleSave = () => {
    dispatch(TaskPackageManagementAction.addTaskData(payload))
  }

  // Callback function to receive data from child
  const handleDataFromChild = (value) => {
    setPayload(value)
  }
  return (
    <DialogModal
      size='100'
      modalID='addNewTaskPackage'
      isLoading={false}
      formID='form-add-new-task'
      func={handleSave}
      title={translate('task.task_management.add_new_task')}
      // disableSubmit={!isFormValidated()}
    >
      <AddTaskPackageModelContent handleDataFromChild={handleDataFromChild} />
    </DialogModal>
  )
}

export default AddTaskComponent
