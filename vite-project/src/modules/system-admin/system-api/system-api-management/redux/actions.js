import { SystemApiServices } from './services'
import { SystemApiConstants } from './constants'

export const SystemApiActions = {
  getSystemApis,
  createSystemApi,
  editSystemApi,
  deleteSystemApi,
  updateSystemApi
}

function getSystemApis(data) {
  return (dispatch) => {
    dispatch({ type: SystemApiConstants.GET_SYSTEM_API_REQUEST })

    SystemApiServices.getSystemApis(data)
      .then((res) => {
        dispatch({
          type: SystemApiConstants.GET_SYSTEM_API_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SystemApiConstants.GET_SYSTEM_API_FAILURE,
          payload: error
        })
      })
  }
}

function createSystemApi(data) {
  return (dispatch) => {
    dispatch({ type: SystemApiConstants.CREATE_SYSTEM_API_REQUEST })

    SystemApiServices.createSystemApi(data)
      .then((res) => {
        dispatch({
          type: SystemApiConstants.CREATE_SYSTEM_API_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SystemApiConstants.CREATE_SYSTEM_API_FAILURE,
          payload: error
        })
      })
  }
}

function editSystemApi(systemApiId, data) {
  return (dispatch) => {
    dispatch({ type: SystemApiConstants.EDIT_SYSTEM_API_REQUEST })

    SystemApiServices.editSystemApi(systemApiId, data)
      .then((res) => {
        dispatch({
          type: SystemApiConstants.EDIT_SYSTEM_API_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: SystemApiConstants.EDIT_SYSTEM_API_FAILURE,
          payload: error
        })
      })
  }
}

function deleteSystemApi(systemApiId) {
  return (dispatch) => {
    dispatch({ type: SystemApiConstants.DELETE_SYSTEM_API_REQUEST })

    SystemApiServices.deleteSystemApi(systemApiId)
      .then((res) => {
        dispatch({
          type: SystemApiConstants.DELETE_SYSTEM_API_SUCCESS,
          payload: systemApiId
        })
      })
      .catch((error) => {
        dispatch({
          type: SystemApiConstants.DELETE_SYSTEM_API_FAILURE,
          payload: error
        })
      })
  }
}

function updateSystemApi() {
  return (dispatch) => {
    dispatch({ type: SystemApiConstants.UPDATE_AUTO_SYSTEM_API_REQUEST })

    return SystemApiServices.updateSystemApi()
      .then((res) => {
        dispatch({
          type: SystemApiConstants.UPDATE_AUTO_SYSTEM_API_SUCCESS
        })

        return res.data.content
      })
      .catch((error) => {
        dispatch({
          type: SystemApiConstants.UPDATE_AUTO_SYSTEM_API_FAILURE,
          payload: error
        })
      })
  }
}
