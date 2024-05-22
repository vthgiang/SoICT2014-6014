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

export default {
  getTaskPackagesData
}
