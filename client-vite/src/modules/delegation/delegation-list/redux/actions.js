import { delegationConstants } from './constants'
import { delegationServices } from './services'

function getDelegations(queryData) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.GET_ALL_DELEGATIONS_REQUEST
    })

    delegationServices
      .getDelegations(queryData)
      .then((res) => {
        dispatch({
          type: delegationConstants.GET_ALL_DELEGATIONS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.GET_ALL_DELEGATIONS_FAILURE,
          error
        })
      })
  }
}

function deleteDelegations(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.DELETE_DELEGATION_REQUEST
    })

    delegationServices
      .deleteDelegations(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.DELETE_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationIds: data.delegationIds
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.DELETE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function revokeDelegation(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.REVOKE_DELEGATION_REQUEST
    })

    delegationServices
      .revokeDelegation(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.REVOKE_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationIds: data.delegationIds,
          reason: data.reason
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.REVOKE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function createDelegation(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.CREATE_DELEGATION_REQUEST
    })
    delegationServices
      .createDelegation(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.CREATE_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.CREATE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function editDelegation(id, data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.EDIT_DELEGATION_REQUEST
    })
    delegationServices
      .editDelegation(id, data)
      .then((res) => {
        dispatch({
          type: delegationConstants.EDIT_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.EDIT_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function getDelegationsTask(queryData) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.GET_ALL_DELEGATIONS_TASK_REQUEST
    })

    delegationServices
      .getDelegationsTask(queryData)
      .then((res) => {
        dispatch({
          type: delegationConstants.GET_ALL_DELEGATIONS_TASK_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.GET_ALL_DELEGATIONS_TASK_FAILURE,
          error
        })
      })
  }
}

function deleteTaskDelegations(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.DELETE_TASK_DELEGATION_REQUEST
    })

    delegationServices
      .deleteTaskDelegations(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.DELETE_TASK_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationIds: data.delegationIds
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.DELETE_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function revokeTaskDelegation(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.REVOKE_TASK_DELEGATION_REQUEST
    })

    delegationServices
      .revokeTaskDelegation(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.REVOKE_TASK_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationIds: data.delegationIds,
          reason: data.reason
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.REVOKE_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function createTaskDelegation(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.CREATE_TASK_DELEGATION_REQUEST
    })
    delegationServices
      .createTaskDelegation(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.CREATE_TASK_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.CREATE_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function editTaskDelegation(id, data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.EDIT_TASK_DELEGATION_REQUEST
    })
    delegationServices
      .editTaskDelegation(id, data)
      .then((res) => {
        dispatch({
          type: delegationConstants.EDIT_TASK_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.EDIT_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function getDelegationsService(queryData) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.GET_ALL_DELEGATIONS_SERVICE_REQUEST
    })

    delegationServices
      .getDelegationsService(queryData)
      .then((res) => {
        dispatch({
          type: delegationConstants.GET_ALL_DELEGATIONS_SERVICE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.GET_ALL_DELEGATIONS_SERVICE_FAILURE,
          error
        })
      })
  }
}

function deleteServiceDelegations(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.DELETE_SERVICE_DELEGATION_REQUEST
    })

    delegationServices
      .deleteServiceDelegations(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.DELETE_SERVICE_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationIds: data.delegationIds
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.DELETE_SERVICE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function revokeServiceDelegation(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.REVOKE_SERVICE_DELEGATION_REQUEST
    })

    delegationServices
      .revokeServiceDelegation(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.REVOKE_SERVICE_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationIds: data.delegationIds,
          reason: data.reason
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.REVOKE_SERVICE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function createServiceDelegation(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.CREATE_SERVICE_DELEGATION_REQUEST
    })
    delegationServices
      .createServiceDelegation(data)
      .then((res) => {
        dispatch({
          type: delegationConstants.CREATE_SERVICE_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.CREATE_SERVICE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function editServiceDelegation(id, data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.EDIT_SERVICE_DELEGATION_REQUEST
    })
    delegationServices
      .editServiceDelegation(id, data)
      .then((res) => {
        dispatch({
          type: delegationConstants.EDIT_SERVICE_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.EDIT_SERVICE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

export const DelegationActions = {
  getDelegations,
  deleteDelegations,
  createDelegation,
  editDelegation,
  revokeDelegation,
  getDelegationsTask,
  deleteTaskDelegations,
  createTaskDelegation,
  editTaskDelegation,
  revokeTaskDelegation,
  getDelegationsService,
  deleteServiceDelegations,
  createServiceDelegation,
  editServiceDelegation,
  revokeServiceDelegation
}
