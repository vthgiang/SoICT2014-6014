import { requestConstants } from './constants'
import { requestServices } from './services'

export const RequestActions = {
  getAllRequestByCondition,
  createRequest,
  getDetailRequest,
  editRequest,
  getNumberStatus
}

function getAllRequestByCondition(query = {}) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.GET_ALL_REQUEST_REQUEST
    })
    requestServices
      .getAllRequestByCondition(query)
      .then((res) => {
        dispatch({
          type: requestConstants.GET_ALL_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.GET_ALL_REQUEST_FAILURE,
          error
        })
      })
  }
}

function createRequest(data) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.CREATE_REQUEST_REQUEST
    })
    requestServices
      .createRequest(data)
      .then((res) => {
        dispatch({
          type: requestConstants.CREATE_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.CREATE_REQUEST_FAILURE,
          error
        })
      })
  }
}

function getDetailRequest(id) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.GET_DETAIL_REQUEST_REQUEST
    })
    requestServices
      .getDetailRequest(id)
      .then((res) => {
        dispatch({
          type: requestConstants.GET_DETAIL_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.GET_DETAIL_REQUEST_FAILURE,
          error
        })
      })
  }
}

function editRequest(id, data) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.UPDATE_REQUEST_REQUEST
    })
    requestServices
      .editRequest(id, data)
      .then((res) => {
        dispatch({
          type: requestConstants.UPDATE_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.UPDATE_REQUEST_FAILURE,
          error
        })
      })
  }
}

function getNumberStatus(query) {
  return (dispatch) => {
    dispatch({
      type: requestConstants.GET_NUMBER_REQUEST_REQUEST
    })
    requestServices
      .getNumberStatus(query)
      .then((res) => {
        dispatch({
          type: requestConstants.GET_NUMBER_REQUEST_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: requestConstants.GET_NUMBER_REQUEST_FAILURE,
          error
        })
      })
  }
}
