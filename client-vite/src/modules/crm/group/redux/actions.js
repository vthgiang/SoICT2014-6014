import { CrmGroupServices } from './services'
import { CrmGroupConstants } from './constants'

export const CrmGroupActions = {
  getGroups,
  getGroup,
  createGroup,
  editGroup,
  deleteGroup,
  addPromotion,
  editPromotion,
  deletePromotion,
  getMembersGroup
}

function getGroups(data) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.GET_CRM_GROUPS_REQUEST })
    CrmGroupServices.getGroups(data)
      .then((res) => {
        dispatch({
          type: CrmGroupConstants.GET_CRM_GROUPS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.GET_CRM_GROUPS_FAILE })
      })
  }
}

function getGroup(id) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.GET_CRM_GROUP_REQUEST })
    CrmGroupServices.getGroup(id)
      .then((res) => {
        dispatch({
          type: CrmGroupConstants.GET_CRM_GROUP_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.GET_CRM_GROUP_FAILE })
      })
  }
}

function createGroup(data) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.CREATE_CRM_GROUP_REQUEST })
    CrmGroupServices.createGroup(data)
      .then((res) => {
        dispatch({
          type: CrmGroupConstants.CREATE_CRM_GROUP_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.CREATE_CRM_GROUP_FAILE })
      })
  }
}

function editGroup(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.EDIT_CRM_GROUP_REQUEST })
    CrmGroupServices.editGroup(id, data)
      .then((res) => {
        dispatch({
          type: CrmGroupConstants.EDIT_CRM_GROUP_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.EDIT_CRM_GROUP_FAILE })
      })
  }
}

function deleteGroup(id) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.DELETE_CRM_GROUP_REQUEST })
    CrmGroupServices.deleteGroup(id)
      .then((res) => {
        dispatch({
          type: CrmGroupConstants.DELETE_CRM_GROUP_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.DELETE_CRM_GROUP_FAILE })
      })
  }
}

function addPromotion(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.ADD_CRM_GROUP_PROMOTION_REQUEST })
    CrmGroupServices.addPromotion(id, data)
      .then((res) => {
        dispatch({
          type: CrmGroupConstants.ADD_CRM_GROUP_PROMOTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.ADD_CRM_GROUP_PROMOTION_FAILE })
      })
  }
}

function editPromotion(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.EDIT_CRM_GROUP_PROMOTION_REQUEST })
    CrmGroupServices.editPromotion(id, data)
      .then((res) => {
        dispatch({
          type: CrmGroupConstants.EDIT_CRM_GROUP_PROMOTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.EDIT_CRM_GROUP_PROMOTION_FAILE })
      })
  }
}

function deletePromotion(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.DELETE_CRM_GROUP_PROMOTION_REQUEST })
    CrmGroupServices.deletePromotion(id, data)
      .then((res) => {
        console.log(res)
        dispatch({
          type: CrmGroupConstants.DELETE_CRM_GROUP_PROMOTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.DELETE_CRM_GROUP_PROMOTION_FAILE })
      })
  }
}

function getMembersGroup(id) {
  return (dispatch) => {
    dispatch({ type: CrmGroupConstants.GET_CRM_MEMBERS_IN_GROUP_REQUEST })
    CrmGroupServices.getMembersGroup(id)
      .then((res) => {
        dispatch({
          type: CrmGroupConstants.GET_CRM_MEMBERS_IN_GROUP_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmGroupConstants.GET_CRM_MEMBERS_IN_GROUP_FAILE })
      })
  }
}
