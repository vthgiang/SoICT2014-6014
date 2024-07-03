import { ConfigManagementConstant } from './constants'

const initState = {
  company: '',
  numberGeneration: 0,
  solutionSize: 0,
  isAutomatically: false,
  defaultSetting: {
    numberGeneration: 0,
    solutionSize: 0
  },
  isLoading: false,
  allocationResult: {}
}

export function configParametersReducer(state = initState, action) {
  switch (action.type) {
    case ConfigManagementConstant.GET_CONFIG_SETTING_DATA_REQUEST:
    case ConfigManagementConstant.UPDATE_CONFIG_SETTING_DATA_REQUEST:
    case ConfigManagementConstant.HANDLE_START_ALLOCATION_REQUEST:
    case ConfigManagementConstant.ASSIGN_ALLOCATION_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ConfigManagementConstant.GET_CONFIG_SETTING_DATA_REQUEST_SUCCESS:
    case ConfigManagementConstant.UPDATE_CONFIG_SETTING_DATA_REQUEST_SUCCESS:
      return {
        ...action.payload,
        isLoading: false
      }

    case ConfigManagementConstant.GET_CONFIG_SETTING_DATA_REQUEST_FAILED:
    case ConfigManagementConstant.UPDATE_CONFIG_SETTING_DATA_REQUEST_FAILED:
    case ConfigManagementConstant.HANDLE_START_ALLOCATION_REQUEST_FAILED:
    case ConfigManagementConstant.ASSIGN_ALLOCATION_REQUEST_FAILED:
      return {
        ...state,
        isLoading: false
      }
    case ConfigManagementConstant.UPDATE_CONFIG_SETTING:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }
    case ConfigManagementConstant.HANDLE_START_ALLOCATION_REQUEST_SUCCESS:
      return {
        ...state,
        allocationResult: action.payload,
        isLoading: false
      }
    case ConfigManagementConstant.ASSIGN_ALLOCATION_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}
