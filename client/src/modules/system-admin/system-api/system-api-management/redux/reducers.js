import { SystemApiConstants } from './constants'

const initState = {
  listPaginateApi: []
}

export function systemApis(state = initState, action) {
  switch (action.type) {
    case SystemApiConstants.GET_SYSTEM_API_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case SystemApiConstants.GET_SYSTEM_API_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPaginateApi: action.payload.systemApis,
        totalSystemApis: action.payload.totalSystemApis,
        totalPages: action.payload.totalPages
      }
    case SystemApiConstants.GET_SYSTEM_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case SystemApiConstants.CREATE_SYSTEM_API_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case SystemApiConstants.CREATE_SYSTEM_API_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPaginateApi: [action.payload, ...state.listPaginateApi]
      }
    case SystemApiConstants.CREATE_SYSTEM_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case SystemApiConstants.EDIT_SYSTEM_API_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case SystemApiConstants.EDIT_SYSTEM_API_SUCCESS:
      let temp = state.listPaginateApi
      temp = temp?.map((item) => {
        if (item?._id === action.payload?._id) {
          return action.payload
        } else return item
      })
      return {
        ...state,
        isLoading: false,
        listPaginateApi: temp
      }

    case SystemApiConstants.EDIT_SYSTEM_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case SystemApiConstants.DELETE_SYSTEM_API_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case SystemApiConstants.DELETE_SYSTEM_API_SUCCESS:
      let currentListPaginateApi = state.listPaginateApi
      for (let i = 0; i < currentListPaginateApi?.length; i++) {
        if (currentListPaginateApi?.[i]?._id === action.payload) {
          currentListPaginateApi.splice(i, 1)
        }
      }
      return {
        ...state,
        isLoading: false,
        listPaginateApi: currentListPaginateApi
      }
    case SystemApiConstants.DELETE_SYSTEM_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case SystemApiConstants.UPDATE_AUTO_SYSTEM_API_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case SystemApiConstants.UPDATE_AUTO_SYSTEM_API_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case SystemApiConstants.UPDATE_AUTO_SYSTEM_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
