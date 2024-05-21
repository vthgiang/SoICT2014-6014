import { InternalServiceIdentityServices } from './services'
import { InternalServiceIdentityConstants } from './constants'

function getInternalServiceIdentities(data) {
  return (dispatch) => {
    dispatch({ type: InternalServiceIdentityConstants.GET_INTERNAL_SERVICE_IDENTITY_REQUEST })

    InternalServiceIdentityServices.getInternalServiceIdentities(data)
      .then((res) => {
        dispatch({
          type: InternalServiceIdentityConstants.GET_INTERNAL_SERVICE_IDENTITY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: InternalServiceIdentityConstants.GET_INTERNAL_SERVICE_IDENTITY_FAILURE,
          payload: error
        })
      })
  }
}

function createInternalServiceIdentity(data) {
  return (dispatch) => {
    dispatch({ type: InternalServiceIdentityConstants.CREATE_INTERNAL_SERVICE_IDENTITY_REQUEST })

    InternalServiceIdentityServices.createInternalServiceIdentity(data)
      .then((res) => {
        dispatch({
          type: InternalServiceIdentityConstants.CREATE_INTERNAL_SERVICE_IDENTITY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: InternalServiceIdentityConstants.CREATE_INTERNAL_SERVICE_IDENTITY_FAILURE,
          payload: error
        })
      })
  }
}

function editInternalServiceIdentity(internalServiceIdentityId, data) {
  return (dispatch) => {
    dispatch({ type: InternalServiceIdentityConstants.EDIT_INTERNAL_SERVICE_IDENTITY_REQUEST })

    InternalServiceIdentityServices.editInternalServiceIdentity(internalServiceIdentityId, data)
      .then((res) => {
        dispatch({
          type: InternalServiceIdentityConstants.EDIT_INTERNAL_SERVICE_IDENTITY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: InternalServiceIdentityConstants.EDIT_INTERNAL_SERVICE_IDENTITY_FAILURE,
          payload: error
        })
      })
  }
}

function deleteInternalServiceIdentity(internalServiceIdentityId) {
  return (dispatch) => {
    dispatch({ type: InternalServiceIdentityConstants.DELETE_INTERNAL_SERVICE_IDENTITY_REQUEST })

    InternalServiceIdentityServices.deleteInternalServiceIdentity(internalServiceIdentityId)
      .then((res) => {
        dispatch({
          type: InternalServiceIdentityConstants.DELETE_INTERNAL_SERVICE_IDENTITY_SUCCESS,
          payload: internalServiceIdentityId
        })
      })
      .catch((error) => {
        dispatch({
          type: InternalServiceIdentityConstants.DELETE_INTERNAL_SERVICE_IDENTITY_FAILURE,
          payload: error
        })
      })
  }
}

export const InternalServiceIdentityActions = {
  getInternalServiceIdentities,
  createInternalServiceIdentity,
  editInternalServiceIdentity,
  deleteInternalServiceIdentity
}
