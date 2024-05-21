import { InternalServiceIdentityConstants } from './constants'

const initState = {
  listInternalServiceIdentity: []
}

export function internalServiceIdentities(state = initState, action) {
  switch (action.type) {
    case InternalServiceIdentityConstants.GET_INTERNAL_SERVICE_IDENTITY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case InternalServiceIdentityConstants.GET_INTERNAL_SERVICE_IDENTITY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listInternalServiceIdentity: action.payload.data,
        totalInternalServiceIdentities: action.payload.totalInternalServiceIdentities,
        totalPages: action.payload.totalPages
      }
    case InternalServiceIdentityConstants.GET_INTERNAL_SERVICE_IDENTITY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case InternalServiceIdentityConstants.CREATE_INTERNAL_SERVICE_IDENTITY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case InternalServiceIdentityConstants.CREATE_INTERNAL_SERVICE_IDENTITY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listInternalServiceIdentity: [action.payload, ...state.listInternalServiceIdentity]
      }
    case InternalServiceIdentityConstants.CREATE_INTERNAL_SERVICE_IDENTITY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case InternalServiceIdentityConstants.EDIT_INTERNAL_SERVICE_IDENTITY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case InternalServiceIdentityConstants.EDIT_INTERNAL_SERVICE_IDENTITY_SUCCESS:
      let temp = state.listInternalServiceIdentity
      temp = temp?.map((item) => {
        if (item?.id === action.payload?.id) {
          return action.payload
        }
        return item
      })
      return {
        ...state,
        isLoading: false,
        listInternalServiceIdentity: temp
      }

    case InternalServiceIdentityConstants.EDIT_INTERNAL_SERVICE_IDENTITY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case InternalServiceIdentityConstants.DELETE_INTERNAL_SERVICE_IDENTITY_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case InternalServiceIdentityConstants.DELETE_INTERNAL_SERVICE_IDENTITY_SUCCESS:
      const currentList = state.listInternalServiceIdentity
      for (let i = 0; i < currentList?.length; i++) {
        if (currentList?.[i]?.id === action.payload) {
          currentList.splice(i, 1)
        }
      }
      return {
        ...state,
        isLoading: false,
        listInternalServiceIdentity: currentList
      }
    case InternalServiceIdentityConstants.DELETE_INTERNAL_SERVICE_IDENTITY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
