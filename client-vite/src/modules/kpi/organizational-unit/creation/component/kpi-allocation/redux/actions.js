import { ConfigManagementConstant } from './constants'
import { ConfigParametersServices } from './services'

const getConfigSettingData = () => {
  return (dispatch) => {
    dispatch({ type: ConfigManagementConstant.GET_CONFIG_SETTING_DATA_REQUEST })
    ConfigParametersServices.getConfigSettingData()
      .then((response) => {
        dispatch({
          type: ConfigManagementConstant.GET_CONFIG_SETTING_DATA_REQUEST_SUCCESS,
          payload: response.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: ConfigManagementConstant.GET_CONFIG_SETTING_DATA_REQUEST_FAILED
        })
      })
  }
}

const updateConfigSettingData = (_id, payload) => {
  return (dispatch) => {
    dispatch({ type: ConfigManagementConstant.UPDATE_CONFIG_SETTING_DATA_REQUEST })
    ConfigParametersServices.updateConfigSettingData(_id, payload)
      .then((response) => {
        dispatch({
          type: ConfigManagementConstant.UPDATE_CONFIG_SETTING_DATA_REQUEST_SUCCESS,
          payload: response.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: ConfigManagementConstant.UPDATE_CONFIG_SETTING_DATA_REQUEST_FAILED
        })
      })
  }
}

const updateConfigSetting = (key, value) => {
  return {
    type: ConfigManagementConstant.UPDATE_CONFIG_SETTING,
    payload: { key, value }
  }
}

const handleStartAllocation = (payload) => {
  return (dispatch) => {
    dispatch({ type: ConfigManagementConstant.HANDLE_START_ALLOCATION_REQUEST })
    ConfigParametersServices.startAllocation(payload)
      .then((response) => {
        dispatch({
          type: ConfigManagementConstant.HANDLE_START_ALLOCATION_REQUEST_SUCCESS,
          payload: response.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: ConfigManagementConstant.HANDLE_START_ALLOCATION_REQUEST_FAILED
        })
      })
  }
}

const handleAssignAllocation = (payload) => {
  return (dispatch) => {
    dispatch({ type: ConfigManagementConstant.ASSIGN_ALLOCATION_REQUEST })
    ConfigParametersServices.startAssignAllocation(payload)
      .then((response) => {
        dispatch({
          type: ConfigManagementConstant.ASSIGN_ALLOCATION_REQUEST_SUCCESS,
          payload: response.data.content
        })
      })
      .catch(() => {
        dispatch({
          type: ConfigManagementConstant.HANDLE_START_ALLOCATION_REQUEST_FAILED
        })
      })
  }
}

export const ConfigParametersAction = {
  getConfigSettingData,
  updateConfigSetting,
  updateConfigSettingData,
  handleStartAllocation,
  handleAssignAllocation
}
