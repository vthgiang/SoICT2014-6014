import { AuthorizationLoggingConstants } from './constants'

const initState = {
  listPaginate: [],
  isLoading: false
}

export function authorizationLogging(state = initState, action) {
  switch (action.type) {
    case AuthorizationLoggingConstants.GET_AUTHORIZATION_LOGGING_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case AuthorizationLoggingConstants.GET_AUTHORIZATION_LOGGING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPaginate: action.payload.data,
        totalLoggingRecords: action.payload.totalLoggingRecords,
        totalPages: action.payload.totalPages
      }
    case AuthorizationLoggingConstants.GET_AUTHORIZATION_LOGGING_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
