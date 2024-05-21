import { ExternalPolicyConstants } from './constants'

const initState = {
  listExternalPolicy: []
}

export function externalPolicies(state = initState, action) {
  switch (action.type) {
    case ExternalPolicyConstants.GET_EXTERNAL_POLICY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ExternalPolicyConstants.GET_EXTERNAL_POLICY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listExternalPolicy: action.payload.data,
        totalExternalPolicies: action.payload.totalExternalPolicies,
        totalPages: action.payload.totalPages
      }
    case ExternalPolicyConstants.GET_EXTERNAL_POLICY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case ExternalPolicyConstants.CREATE_EXTERNAL_POLICY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ExternalPolicyConstants.CREATE_EXTERNAL_POLICY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listExternalPolicy: [action.payload, ...state.listExternalPolicy]
      }
    case ExternalPolicyConstants.CREATE_EXTERNAL_POLICY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case ExternalPolicyConstants.EDIT_EXTERNAL_POLICY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ExternalPolicyConstants.EDIT_EXTERNAL_POLICY_SUCCESS:
      let temp = state.listExternalPolicy
      temp = temp?.map((item) => {
        if (item?.id === action.payload?.id) {
          return action.payload
        }
        return item
      })
      return {
        ...state,
        isLoading: false,
        listExternalPolicy: temp
      }

    case ExternalPolicyConstants.EDIT_EXTERNAL_POLICY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case ExternalPolicyConstants.DELETE_EXTERNAL_POLICY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ExternalPolicyConstants.DELETE_EXTERNAL_POLICY_SUCCESS:
      const currentList = state.listExternalPolicy
      for (let i = 0; i < currentList?.length; i++) {
        if (currentList?.[i]?.id === action.payload) {
          currentList.splice(i, 1)
        }
      }
      return {
        ...state,
        isLoading: false,
        listExternalPolicy: currentList
      }
    case ExternalPolicyConstants.DELETE_EXTERNAL_POLICY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
