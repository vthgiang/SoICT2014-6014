import { ConfigManagementConstant } from './constants'

const initState = {
  company: '',
  numberGeneration: 0,
  solutionSize: 0,
  hmcr: 0,
  par: 0,
  bandwidth: 0,
  alpha: 0,
  beta: 0,
  gamma: 0,
  isAutomatically: false,
  defaultSetting: {
    numberGeneration: 0,
    solutionSize: 0,
    hmcr: 0,
    par: 0,
    bandwidth: 0,
    alpha: 0,
    beta: 0,
    gamma: 0
  },
  isLoading: false
}

export function configManagementReducer(state = initState, action) {
  switch (action.type) {
    case ConfigManagementConstant.GET_CONFIG_SETTING_DATA_REQUEST:
    case ConfigManagementConstant.UPDATE_CONFIG_SETTING_DATA_REQUEST:
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
      return {
        ...state,
        isLoading: false
      }
    case ConfigManagementConstant.UPDATE_CONFIG_SETTING:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }
    default:
      return state
  }
}
