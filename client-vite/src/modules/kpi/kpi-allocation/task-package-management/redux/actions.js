import { TaskPackageManagementConstants } from './constants'
import { TaskPackageManagementService } from './services'

const getTaskPackagesData = () => {
  return async (dispatch) => {
    dispatch({ type: TaskPackageManagementConstants.GET_TASK_PACKAGES_DATA })

    try {
      const response = await TaskPackageManagementService.getTaskPackagesData()
      dispatch({ type: TaskPackageManagementConstants.GET_TASK_PACKAGES_DATA_SUCCESS, payload: response.data.content })
    } catch (error) {
      dispatch({ type: TaskPackageManagementConstants.GET_TASK_PACKAGES_DATA_FAILED })
    }
  }
}

const getTaskTypeData = () => {
  return async (dispatch) => {
    dispatch({ type: TaskPackageManagementConstants.GET_TASK_TYPE_DATA })

    try {
      const response = await TaskPackageManagementService.getTaskTypeData()
      dispatch({ type: TaskPackageManagementConstants.GET_TASK_TYPE_DATA_SUCCESS, payload: response.data.content })
    } catch (error) {
      dispatch({ type: TaskPackageManagementConstants.GET_TASK_TYPE_DATA_FAILED })
    }
  }
}

const addTaskTypeData = (payload) => {
  return async (dispatch) => {
    dispatch({ type: TaskPackageManagementConstants.ADD_TASK_TYPE_DATA })

    try {
      const response = await TaskPackageManagementService.addTaskTypeData(payload)
      dispatch({ type: TaskPackageManagementConstants.ADD_TASK_TYPE_DATA_SUCCESS, payload: response.data.content })
    } catch (error) {
      dispatch({ type: TaskPackageManagementConstants.ADD_TASK_TYPE_DATA_FAILED })
    }
  }
}

const addTaskData = (payload) => {
  return async (dispatch) => {
    dispatch({ type: TaskPackageManagementConstants.ADD_TASK_DATA })

    try {
      const response = await TaskPackageManagementService.addTaskData(payload)
      dispatch({ type: TaskPackageManagementConstants.ADD_TASK_DATA_SUCCESS, payload: response.data.content })
    } catch (error) {
      dispatch({ type: TaskPackageManagementConstants.ADD_TASK_DATA_FAILED })
    }
  }
}

export const TaskPackageManagementAction = {
  getTaskPackagesData,
  getTaskTypeData,
  addTaskTypeData,
  addTaskData
}
