import { TaskPackageManagementConstants } from './constants'

const { GET_TASK_PACKAGES_DATA, GET_TASK_PACKAGES_DATA_FAILED, GET_TASK_PACKAGES_DATA_SUCCESS } = TaskPackageManagementConstants

const initState = {
  test: '',
  isLoading: false
}

export function taskPackageManagementReducer(state = initState, action) {
  switch (action.type) {
    case GET_TASK_PACKAGES_DATA:
      return {
        ...state,
        isLoading: true
      }
    case GET_TASK_PACKAGES_DATA_SUCCESS:
      return {
        ...action.payload,
        isLoading: false
      }
    case GET_TASK_PACKAGES_DATA_FAILED:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}
