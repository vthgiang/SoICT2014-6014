import { InternalPolicyConstants } from './constants'

const initState = {
  listInternalPolicy: []
}

export function internalPolicies(state = initState, action) {
  switch (action.type) {
    case InternalPolicyConstants.GET_INTERNAL_POLICY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case InternalPolicyConstants.GET_INTERNAL_POLICY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listInternalPolicy: action.payload.data,
        totalInternalPolicies: action.payload.totalInternalPolicies,
        totalPages: action.payload.totalPages
      }
    case InternalPolicyConstants.GET_INTERNAL_POLICY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case InternalPolicyConstants.CREATE_INTERNAL_POLICY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case InternalPolicyConstants.CREATE_INTERNAL_POLICY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listInternalPolicy: [action.payload, ...state.listInternalPolicy]
      }
    case InternalPolicyConstants.CREATE_INTERNAL_POLICY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case InternalPolicyConstants.EDIT_INTERNAL_POLICY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case InternalPolicyConstants.EDIT_INTERNAL_POLICY_SUCCESS:
      let temp = state.listInternalPolicy
      temp = temp?.map((item) => {
        if (item?.id === action.payload?.id) {
          return action.payload
        }
        return item
      })
      return {
        ...state,
        isLoading: false,
        listInternalPolicy: temp
      }

    case InternalPolicyConstants.EDIT_INTERNAL_POLICY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case InternalPolicyConstants.DELETE_INTERNAL_POLICY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case InternalPolicyConstants.DELETE_INTERNAL_POLICY_SUCCESS:
      const currentList = state.listInternalPolicy
      for (let i = 0; i < currentList?.length; i++) {
        if (currentList?.[i]?.id === action.payload) {
          currentList.splice(i, 1)
        }
      }
      return {
        ...state,
        isLoading: false,
        listInternalPolicy: currentList
      }
    case InternalPolicyConstants.DELETE_INTERNAL_POLICY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
