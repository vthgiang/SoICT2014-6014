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
  listsRole: [],
  listsTask: [],
  listsResource: [],
  isLoading: false,
  error: null,
  totalList: 0,
  totalListTask: 0,
  totalListResource: 0
}

export function delegationReceive(state = initialState, action) {
  let index = -1
  let indexTask = -1
  let indexResource = -1
  switch (action.type) {
    case delegationConstants.GET_ALL_DELEGATIONS_REQUEST:
    case delegationConstants.GET_ALL_DELEGATIONS_TASK_REQUEST:
    case delegationConstants.REJECT_DELEGATION_REQUEST:
    case delegationConstants.CONFIRM_DELEGATION_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case delegationConstants.GET_ALL_DELEGATIONS_FAILURE:
    case delegationConstants.GET_ALL_DELEGATIONS_TASK_FAILURE:
    case delegationConstants.REJECT_DELEGATION_FAILURE:
    case delegationConstants.CONFIRM_DELEGATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case delegationConstants.GET_ALL_DELEGATIONS_SUCCESS:
      return {
        ...state,
        listsRole: action.payload.data,
        totalList: action.payload.totalList,
        isLoading: false
      }
    case delegationConstants.REJECT_DELEGATION_SUCCESS:
      index = findIndex(state.listsRole, action.payload._id)
      if (index !== -1) {
        state.listsRole[index] = action.payload
      }

      indexTask = findIndex(state.listsTask, action.payload._id)
      if (indexTask !== -1) {
        state.listsTask[indexTask] = action.payload
      }

      indexResource = findIndex(state.listsResource, action.payload._id)
      if (indexResource !== -1) {
        state.listsResource[indexResource] = action.payload
      }
      return {
        ...state,
        isLoading: false
      }
    case delegationConstants.CONFIRM_DELEGATION_SUCCESS:
      index = findIndex(state.listsRole, action.payload._id)
      if (index !== -1) {
        state.listsRole[index] = action.payload
      }

      indexTask = findIndex(state.listsTask, action.payload._id)
      if (indexTask !== -1) {
        state.listsTask[indexTask] = action.payload
      }

      indexResource = findIndex(state.listsResource, action.payload._id)
      if (indexResource !== -1) {
        state.listsResource[indexResource] = action.payload
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
    case delegationConstants.GET_ALL_DELEGATIONS_RESOURCE_SUCCESS:
      return {
        ...state,
        listsResource: action.payload.data,
        totalListResource: action.payload.totalList,
        isLoading: false
      }
    default:
      return state
  }
}
