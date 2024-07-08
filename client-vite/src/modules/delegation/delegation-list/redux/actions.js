import { delegationConstants } from './constants'
import { delegationServices } from './services'

function getDelegations(queryData) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.GET_ALL_DELEGATIONS_REQUEST
    })

    delegationServices
      .getDelegations(queryData, delegationConstants.ROLE)
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
      .deleteDelegations(data, delegationConstants.ROLE)
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
      .revokeDelegation(data, delegationConstants.ROLE)
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
      .createDelegation(data, delegationConstants.ROLE)
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
      .editDelegation(id, data, delegationConstants.ROLE)
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
      .getDelegations(queryData, delegationConstants.TASK)
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
      .deleteDelegations(data, delegationConstants.TASK)
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
      .revokeDelegation(data, delegationConstants.TASK)
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
      .createDelegation(data, delegationConstants.TASK)
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
      .editDelegation(id, data, delegationConstants.TASK)
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

function getDelegationsResource(queryData) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.GET_ALL_DELEGATIONS_RESOURCE_REQUEST
    })

    delegationServices
      .getDelegations(queryData, delegationConstants.RESOURCE)
      .then((res) => {
        dispatch({
          type: delegationConstants.GET_ALL_DELEGATIONS_RESOURCE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.GET_ALL_DELEGATIONS_RESOURCE_FAILURE,
          error
        })
      })
  }
}

function deleteResourceDelegations(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.DELETE_RESOURCE_DELEGATION_REQUEST
    })

    delegationServices
      .deleteDelegations(data, delegationConstants.RESOURCE)
      .then((res) => {
        dispatch({
          type: delegationConstants.DELETE_RESOURCE_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationIds: data.delegationIds
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.DELETE_RESOURCE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function revokeResourceDelegation(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.REVOKE_RESOURCE_DELEGATION_REQUEST
    })

    delegationServices
      .revokeDelegation(data, delegationConstants.RESOURCE)
      .then((res) => {
        dispatch({
          type: delegationConstants.REVOKE_RESOURCE_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationIds: data.delegationIds,
          reason: data.reason
        })
      })
      .catch((error) => {
        dispatch({
          type: delegationConstants.REVOKE_RESOURCE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function createResourceDelegation(data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.CREATE_RESOURCE_DELEGATION_REQUEST
    })
    delegationServices
      .createDelegation(data, delegationConstants.RESOURCE)
      .then((res) => {
        dispatch({
          type: delegationConstants.CREATE_RESOURCE_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        console.log("lam", error)

        dispatch({
          type: delegationConstants.CREATE_RESOURCE_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function editResourceDelegation(id, data) {
  return (dispatch) => {
    dispatch({
      type: delegationConstants.EDIT_RESOURCE_DELEGATION_REQUEST
    })
    delegationServices
      .editDelegation(id, data, delegationConstants.RESOURCE)
      .then((res) => {
        dispatch({
          type: delegationConstants.EDIT_RESOURCE_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        console.log("lam", error)
        dispatch({
          type: delegationConstants.EDIT_RESOURCE_DELEGATION_FAILURE,
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
  getDelegationsResource,
  deleteResourceDelegations,
  createResourceDelegation,
  editResourceDelegation,
  revokeResourceDelegation
}
