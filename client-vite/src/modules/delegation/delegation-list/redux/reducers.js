import { delegationConstants } from './constants'

const findIndex = (array, id) => {
  let result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initialState = {
  lists: [],
  listsTask: [],
  isLoading: false,
  error: null,
  totalList: 0,
  totalListTask: 0
}

export function delegation(state = initialState, action) {
  let index = -1
  switch (action.type) {
    case delegationConstants.GET_ALL_DELEGATIONS_REQUEST:
    case delegationConstants.DELETE_DELEGATION_REQUEST:
    case delegationConstants.REVOKE_DELEGATION_REQUEST:
    case delegationConstants.CREATE_DELEGATION_REQUEST:
    case delegationConstants.EDIT_DELEGATION_REQUEST:
    case delegationConstants.GET_ALL_DELEGATIONS_TASK_REQUEST:
    case delegationConstants.DELETE_TASK_DELEGATION_REQUEST:
    case delegationConstants.REVOKE_TASK_DELEGATION_REQUEST:
    case delegationConstants.CREATE_TASK_DELEGATION_REQUEST:
    case delegationConstants.EDIT_TASK_DELEGATION_REQUEST:
    case delegationConstants.GET_ALL_DELEGATIONS_RESOURCE_REQUEST:
    case delegationConstants.DELETE_RESOURCE_DELEGATION_REQUEST:
    case delegationConstants.REVOKE_RESOURCE_DELEGATION_REQUEST:
    case delegationConstants.CREATE_RESOURCE_DELEGATION_REQUEST:
    case delegationConstants.EDIT_RESOURCE_DELEGATION_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case delegationConstants.GET_ALL_DELEGATIONS_FAILURE:
    case delegationConstants.DELETE_DELEGATION_FAILURE:
    case delegationConstants.REVOKE_DELEGATION_FAILURE:
    case delegationConstants.CREATE_DELEGATION_FAILURE:
    case delegationConstants.EDIT_DELEGATION_FAILURE:
    case delegationConstants.GET_ALL_DELEGATIONS_TASK_FAILURE:
    case delegationConstants.DELETE_TASK_DELEGATION_FAILURE:
    case delegationConstants.REVOKE_TASK_DELEGATION_FAILURE:
    case delegationConstants.CREATE_TASK_DELEGATION_FAILURE:
    case delegationConstants.EDIT_TASK_DELEGATION_FAILURE:
    case delegationConstants.GET_ALL_DELEGATIONS_RESOURCE_FAILURE:
    case delegationConstants.DELETE_RESOURCE_DELEGATION_FAILURE:
    case delegationConstants.REVOKE_RESOURCE_DELEGATION_FAILURE:
    case delegationConstants.CREATE_RESOURCE_DELEGATION_FAILURE:
    case delegationConstants.EDIT_RESOURCE_DELEGATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case delegationConstants.GET_ALL_DELEGATIONS_SUCCESS:
      return {
        ...state,
        lists: action.payload.data,
        totalList: action.payload.totalList,
        isLoading: false
      }
    case delegationConstants.DELETE_DELEGATION_SUCCESS:
      return {
        ...state,
        lists: state.lists.filter((delegation) => !action.delegationIds.includes(delegation?._id)),
        isLoading: false
      }
    case delegationConstants.REVOKE_DELEGATION_SUCCESS:
      index = findIndex(state.lists, action.payload._id)
      if (index !== -1) {
        state.lists[index] = action.payload
      }
      return {
        ...state,
        isLoading: false
      }
    case delegationConstants.CREATE_DELEGATION_SUCCESS:
      return {
        ...state,
        lists: [...state.lists, action.payload],
        isLoading: false
      }
    case delegationConstants.EDIT_DELEGATION_SUCCESS:
      index = findIndex(state.lists, action.payload[0])
      if (index !== -1) {
        state.lists[index] = action.payload[1]
      }
      return {
        ...state,
        isLoading: false
      }
    case delegationConstants.GET_ALL_DELEGATIONS_TASK_SUCCESS:
      return {
        ...state,
        listsTask: action.payload.data,
        totalListTask: action.payload.totalList,
        isLoading: false
      }
    case delegationConstants.DELETE_TASK_DELEGATION_SUCCESS:
      return {
        ...state,
        listsTask: state.listsTask.filter((delegation) => !action.delegationIds.includes(delegation?._id)),
        isLoading: false
      }
    case delegationConstants.REVOKE_TASK_DELEGATION_SUCCESS:
      index = findIndex(state.listsTask, action.payload._id)
      if (index !== -1) {
        state.listsTask[index] = action.payload
      }
      return {
        ...state,
        isLoading: false
      }
    case delegationConstants.CREATE_TASK_DELEGATION_SUCCESS:
      return {
        ...state,
        listsTask: [...state.listsTask, action.payload],
        isLoading: false
      }
    case delegationConstants.EDIT_TASK_DELEGATION_SUCCESS:
      index = findIndex(state.listsTask, action.payload[0])
      if (index !== -1) {
        state.listsTask[index] = action.payload[1]
      }
      return {
        ...state,
        isLoading: false
      }
    case delegationConstants.GET_ALL_DELEGATIONS_RESOURCE_SUCCESS:
      return {
        ...state,
        listsResource: action.payload.data,
        totalListResource: action.payload.totalList,
        isLoading: false
      }
    case delegationConstants.DELETE_RESOURCE_DELEGATION_SUCCESS:
      return {
        ...state,
        listsResource: state.listsResource.filter((delegation) => !action.delegationIds.includes(delegation?._id)),
        isLoading: false
      }
    case delegationConstants.REVOKE_RESOURCE_DELEGATION_SUCCESS:
      index = findIndex(state.listsResource, action.payload._id)
      if (index !== -1) {
        state.listsResource[index] = action.payload
      }
      return {
        ...state,
        isLoading: false
      }
    case delegationConstants.CREATE_RESOURCE_DELEGATION_SUCCESS:
      return {
        ...state,
        listsResource: [...state.listsResource, action.payload],
        isLoading: false
      }
    case delegationConstants.EDIT_RESOURCE_DELEGATION_SUCCESS:
      index = findIndex(state.listsResource, action.payload[0])
      if (index !== -1) {
        state.listsResource[index] = action.payload[1]
      }
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}
