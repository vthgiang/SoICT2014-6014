import { policyConstants } from './constants'

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
  listPaginate: [],
  isLoading: false,
  error: null,
  totalPolicies: 0,
  detailedPolicy: {}
}

export function policyAuthorization(state = initialState, action) {
  let index = -1
  switch (action.type) {
    case policyConstants.GET_ALL_POLICIES_REQUEST:
    case policyConstants.DELETE_POLICY_REQUEST:
    case policyConstants.CREATE_POLICY_REQUEST:
    case policyConstants.EDIT_POLICY_REQUEST:
    case policyConstants.GET_POLICY_BY_ID_REQUEST:
    case policyConstants.GET_DETAILED_POLICY_BY_ID_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case policyConstants.GET_ALL_POLICIES_FAILURE:
    case policyConstants.DELETE_POLICY_FAILURE:
    case policyConstants.CREATE_POLICY_FAILURE:
    case policyConstants.EDIT_POLICY_FAILURE:
    case policyConstants.GET_POLICY_BY_ID_FAILURE:
    case policyConstants.GET_DETAILED_POLICY_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case policyConstants.GET_ALL_POLICIES_SUCCESS:
      return {
        ...state,
        listPaginate: action.payload.data,
        totalPolicies: action.payload.totalPolicies,
        totalPages: action.payload.totalPages,
        isLoading: false
      }
    case policyConstants.DELETE_POLICY_SUCCESS:
      return {
        ...state,
        listPaginate: state.listPaginate.filter((policy) => !action.policyIds.includes(policy?._id)),
        isLoading: false
      }
    case policyConstants.CREATE_POLICY_SUCCESS:
      return {
        ...state,
        listPaginate: [...state.listPaginate, action.payload],
        isLoading: false
      }
    case policyConstants.EDIT_POLICY_SUCCESS:
      index = findIndex(state.listPaginate, action.payload._id)
      if (index !== -1) {
        state.listPaginate[index] = action.payload
      }
      return {
        ...state,
        isLoading: false
      }
    case policyConstants.GET_POLICY_BY_ID_SUCCESS:
      return {
        ...state,
        policySatisfied: action.payload,
        isLoading: false
      }
    case policyConstants.GET_DETAILED_POLICY_BY_ID_SUCCESS:
      return {
        ...state,
        detailedPolicy: action.payload,
        isLoading: false
      }
    default:
      return state
  }
}
