import { TaskPackageManagementConstants } from './constants'

const {
  GET_TASK_PACKAGES_DATA,
  GET_TASK_PACKAGES_DATA_FAILED,
  GET_TASK_PACKAGES_DATA_SUCCESS,
  GET_TASK_TYPE_DATA,
  GET_TASK_TYPE_DATA_FAILED,
  GET_TASK_TYPE_DATA_SUCCESS,
  ADD_TASK_TYPE_DATA,
  ADD_TASK_TYPE_DATA_FAILED,
  ADD_TASK_TYPE_DATA_SUCCESS,
  ADD_TASK_DATA,
  ADD_TASK_DATA_FAILED,
  ADD_TASK_DATA_SUCCESS
} = TaskPackageManagementConstants

const initState = {
  test: '',
  taskTypes: [],
  isLoading: false,
  listTaskPackages: []
}

export function taskPackageManagementReducer(state = initState, action) {
  switch (action.type) {
    case GET_TASK_PACKAGES_DATA:
    case GET_TASK_TYPE_DATA:
    case ADD_TASK_TYPE_DATA:
    case ADD_TASK_DATA:
      return {
        ...state,
        isLoading: true
      }
    case GET_TASK_TYPE_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        taskTypes: action.payload
      }
    case GET_TASK_PACKAGES_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listTaskPackages: action.payload
      }
    case ADD_TASK_TYPE_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        taskTypes: [...state.taskTypes, action.payload]
      }
    case ADD_TASK_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listTaskPackages: [...state.listTaskPackages, action.payload]
      }
    case GET_TASK_PACKAGES_DATA_FAILED:
    case GET_TASK_TYPE_DATA_FAILED:
    case ADD_TASK_TYPE_DATA_FAILED:
    case ADD_TASK_DATA_FAILED:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}
