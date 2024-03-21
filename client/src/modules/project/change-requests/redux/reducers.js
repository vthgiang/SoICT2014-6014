import { ChangeRequestConstants } from './constants'

const initState = {
  isLoading: false,
  changeRequests: [],
  changeRequestsPaginate: [],
  totalDocs: null
}

export function changeRequest(state = initState, action) {
  switch (action.type) {
    case ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST:
    case ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS:
    case ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST:
    case ChangeRequestConstants.GET_PAGINATE_LIST_PROJECT_CHANGE_REQUESTS:
      return {
        ...state,
        isLoading: true
      }
    case ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST_FAILE:
    case ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_FAILE:
    case ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST_FAILE:
    case ChangeRequestConstants.GET_PAGINATE_LIST_PROJECT_CHANGE_REQUESTS_FAILE:
      return {
        ...state,
        isLoading: false
      }

    case ChangeRequestConstants.CREATE_PROJECT_CHANGE_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        changeRequests: action.payload
      }

    case ChangeRequestConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        changeRequests: action.docs,
        totalDocs: action.payload.totalDocs
      }

    case ChangeRequestConstants.GET_PAGINATE_LIST_PROJECT_CHANGE_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        changeRequestsPaginate: action.payload.docs,
        totalDocs: action.payload.totalDocs
      }

    case ChangeRequestConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        changeRequests: action.payload
      }

    default:
      return state
  }
}
