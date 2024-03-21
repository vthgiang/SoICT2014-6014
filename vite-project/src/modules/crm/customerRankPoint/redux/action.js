import { CrmCustomerRankPointServices } from './services'
import { CrmCustomerRankPointConstants } from './constants'

export const CrmCustomerRankPointActions = {
  getCustomerRankPoints,
  createCustomerRankPoint,
  getCustomerRankPoint,
  editCustomerRankPoint,
  deleteCustomerRankPoint
}

function getCustomerRankPoints(data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINTS_REQUEST })
    CrmCustomerRankPointServices.getCustomerRankPoints(data)
      .then((res) => {
        dispatch({
          type: CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINTS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINTS_FAILE })
      })
  }
}

function createCustomerRankPoint(data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerRankPointConstants.CREATE_CRM_CUSTOMERRANKPOINT_REQUEST })
    CrmCustomerRankPointServices.createCustomerRankPoint(data)
      .then((res) => {
        dispatch({
          type: CrmCustomerRankPointConstants.CREATE_CRM_CUSTOMERRANKPOINT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerRankPointConstants.CREATE_CRM_CUSTOMERRANKPOINT_FAILE })
      })
  }
}

function getCustomerRankPoint(id) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINT_REQUEST })
    CrmCustomerRankPointServices.getCustomerRankPoint(id)
      .then((res) => {
        dispatch({
          type: CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerRankPointConstants.GET_CRM_CUSTOMERRANKPOINT_FAILE })
      })
  }
}

function editCustomerRankPoint(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerRankPointConstants.EDIT_CRM_CUSTOMERRANKPOINT_REQUEST })
    CrmCustomerRankPointServices.editCustomerRankPoint(id, data)
      .then((res) => {
        dispatch({
          type: CrmCustomerRankPointConstants.EDIT_CRM_CUSTOMERRANKPOINT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerRankPointConstants.EDIT_CRM_CUSTOMERRANKPOINT_FAILE })
      })
  }
}

function deleteCustomerRankPoint(id) {
  return (dispatch) => {
    dispatch({ type: CrmCustomerRankPointConstants.DELETE_CRM_CUSTOMERRANKPOINT_REQUEST })
    CrmCustomerRankPointServices.deleteCustomerRankPoint(id)
      .then((res) => {
        dispatch({
          type: CrmCustomerRankPointConstants.DELETE_CRM_CUSTOMERRANKPOINT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmCustomerRankPointConstants.DELETE_CRM_CUSTOMERRANKPOINT_FAILE })
      })
  }
}
