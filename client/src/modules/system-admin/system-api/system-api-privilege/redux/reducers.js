import { PrivilegeApiContants } from './constants'

const initState = {
  listPaginatePrivilegeApi: []
}

export function privilegeApis(state = initState, action) {
  switch (action.type) {
    case PrivilegeApiContants.GET_PRIVILEGE_API_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case PrivilegeApiContants.GET_PRIVILEGE_API_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPaginatePrivilegeApi: action.payload.privilegeApis,
        totalPrivilegeApis: action.payload.totalPrivilegeApis,
        totalPages: action.payload.totalPages
      }
    case PrivilegeApiContants.GET_PRIVILEGE_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case PrivilegeApiContants.CREATE_PRIVILEGE_API_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case PrivilegeApiContants.CREATE_PRIVILEGE_API_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPaginatePrivilegeApi: [action.payload, ...state.listPaginatePrivilegeApi],
        totalPriviegeApis: state.totalPriviegeApis++
      }
    case PrivilegeApiContants.CREATE_PRIVILEGE_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case PrivilegeApiContants.UPDATE_STATUS_PRIVILEGE_API_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case PrivilegeApiContants.UPDATE_STATUS_PRIVILEGE_API_SUCCESS:
      let payloadObject = {}
      let temp = state.listPaginatePrivilegeApi

      if (action.payload?.length > 0) {
        action.payload.map((item) => {
          payloadObject[item._id] = item
        })
      }
      temp = temp?.map((item) => {
        if (payloadObject[item?._id]) {
          return payloadObject[item?._id]
        } else return item
      })

      return {
        ...state,
        isLoading: false,
        listPaginatePrivilegeApi: temp
      }
    case PrivilegeApiContants.UPDATE_STATUS_PRIVILEGE_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case PrivilegeApiContants.DELETE_PRIVILEGE_APIS_REQUEST:
      return {
        ...state
      }
    case PrivilegeApiContants.DELETE_PRIVILEGE_APIS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listPaginatePrivilegeApi: state.listPaginatePrivilegeApi.filter(
          (privilegeApi) => !action.privilegeApiIds.includes(privilegeApi?._id)
        )
      }
    case PrivilegeApiContants.DELETE_PRIVILEGE_APIS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}
