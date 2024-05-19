import { ConfigManagementConstant } from './constants'
import { ConfigManagementServices } from './services'

const getConfigSettingData = () => {
  return (dispatch) => {
    dispatch({ type: ConfigManagementConstant.GET_CONFIG_SETTING_DATA_REQUEST })
    ConfigManagementServices.getConfigSettingData()
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
    ConfigManagementServices.updateConfigSettingData(_id, payload)
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

export const ConfigManagementAction = {
  getConfigSettingData,
  updateConfigSetting,
  updateConfigSettingData
}
