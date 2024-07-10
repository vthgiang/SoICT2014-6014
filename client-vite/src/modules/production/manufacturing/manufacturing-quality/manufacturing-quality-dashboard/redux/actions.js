import { qualityDasboardConstants } from "./constants";
import { qualityDasboardService } from "./services"

export const qualityDashboardActions = {
  getNumberCreatedInspection,
  getErrorNumByReporter,
  getErrorNumByGroup
}

function getNumberCreatedInspection(query) {
  return (dispatch) => {
    dispatch({
      type: qualityDasboardConstants.GET_NUMBER_CREATED_INSPECTION_REQUEST
    })
    qualityDasboardService
      .getNumberCreatedInspection(query)
      .then((res) => {
        dispatch({
          type: qualityDasboardConstants.GET_NUMBER_CREATED_INSPECTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: qualityDasboardConstants.GET_NUMBER_CREATED_INSPECTION_FAILURE,
          error
        })
      })
  }
}

function getErrorNumByReporter(query) {
  return (dispatch) => {
    dispatch({
      type: qualityDasboardConstants.GET_ERROR_NUM_BY_REPORTER_REQUEST
    })
    qualityDasboardService
      .getErrorNumByReporter(query)
      .then((res) => {
        dispatch({
          type: qualityDasboardConstants.GET_ERROR_NUM_BY_REPORTER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: qualityDasboardConstants.GET_ERROR_NUM_BY_REPORTER_FAILURE,
          error
        })
      })
  }
}

function getErrorNumByGroup(query) {
  return (dispatch) => {
    dispatch({
      type: qualityDasboardConstants.GET_ERROR_NUM_BY_GROUP_REQUEST
    })
    qualityDasboardService
      .getErrorNumByGroup(query)
      .then((res) => {
        dispatch({
          type: qualityDasboardConstants.GET_ERROR_NUM_BY_GROUP_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: qualityDasboardConstants.GET_ERROR_NUM_BY_GROUP_FAILURE,
          error
        })
      })
  }
}
