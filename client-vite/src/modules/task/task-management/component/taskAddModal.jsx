import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, convertImageBase64ToFile } from '../../../../common-components'
import { getStorage } from '../../../../config'
import { ProjectActions } from '../../../project/projects/redux/actions'
import { taskManagementActions } from '../redux/actions'
import { AddTaskForm } from './addTaskForm'
import ValidationHelper from '../../../../helpers/validationHelper'

function TaskAddModal(props) {
  const [state, setState] = useState({
    newTask: {
      name: '',
      description: '',
      quillDescriptionDefault: '',
      startDate: '',
      endDate: '',
      priority: 3,
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      creator: getStorage('userId'),
      organizationalUnit: '',
      collaboratedWithOrganizationalUnits: [],
      taskTemplate: '',
      taskProject: ''
    },
    currentRole: getStorage('currentRole')
  })

  const { translate, task, id, parentTask, currentTasks, currentProjectTasks, isProjectForm = false, projectId } = props

  const onChangeTaskData = (value) => {
    setState((st) => {
      return {
        ...st,
        newTask: value
      }
    })
  }

  const convertDateTime = (date, time) => {
    const splitter = date.split('-')
    const strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return new Date(strDateTime)
  }

  const handleSubmit = async () => {
    const { newTask } = state
    const startDateTask = convertDateTime(newTask.startDate, newTask.startTime)
    const endDateTask = convertDateTime(newTask.endDate, newTask.endTime)
    const imageDescriptions = convertImageBase64ToFile(newTask?.imgs)

    const data = {
      ...newTask,
      name: newTask?.name ? newTask.name.trim() : newTask?.name,
      startDate: startDateTask,
      endDate: endDateTask,
      taskProject: projectId || newTask.taskProject,
      imgs: null
    }
    const formData = new FormData()

    formData.append('data', JSON.stringify(data))

    imageDescriptions &&
      imageDescriptions.forEach((x) => {
        formData.append('files', x)
      })

    await props.addTask(formData)

    if (props.onHandleReRender) {
      await props.onHandleReRender()
    }
  }

  useEffect(() => {
    const userId = getStorage('userId')
    props.getProjectsDispatch({ calledId: '' })
  }, [])

  const isFormValidated = () => {
    const { name, startDate, endDate, responsibleEmployees, accountableEmployees, errorOnStartDate, errorOnEndDate } = state?.newTask
    const { translate } = props

    if (
      !ValidationHelper.validateEmpty(translate, name).status ||
      !ValidationHelper.validateEmpty(translate, startDate).status ||
      !ValidationHelper.validateEmpty(translate, endDate).status ||
      !ValidationHelper.validateArrayLength(translate, responsibleEmployees).status ||
      !ValidationHelper.validateArrayLength(translate, accountableEmployees).status ||
      errorOnStartDate ||
      errorOnEndDate
    )
      return false
    return true
  }

  return (
    <DialogModal
      size='100'
      modalID={`addNewTask-${id}`}
      isLoading={false}
      formID={`form-add-new-task-${id}`}
      func={handleSubmit}
      title={translate('task.task_management.add_new_task')}
      disableSubmit={!isFormValidated()}
    >
      <AddTaskForm
        quillId={props.id}
        handleChangeTaskData={onChangeTaskData}
        id={id}
        task={task}
        parentTask={parentTask}
        currentTasks={currentTasks}
        projectIdFromDetailProject={projectId}
      />
    </DialogModal>
  )
}

function mapStateToProps(state) {
  const { project } = state
  return { project }
}

const actionCreators = {
  addTask: taskManagementActions.addTask,
  addProjectTask: taskManagementActions.addProjectTask,
  getProjectsDispatch: ProjectActions.getProjectsDispatch
}

const connectedModalAddTask = connect(mapStateToProps, actionCreators)(withTranslate(TaskAddModal))
export { connectedModalAddTask as TaskAddModal }
