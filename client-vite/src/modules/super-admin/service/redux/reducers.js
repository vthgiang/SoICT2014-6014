import { ServiceConstants } from './constants'

const findIndex = (array, id) => {
  let result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initState = {
  list: [],
  listPaginate: [],
  totalServices: 0,
  totalPages: 0,
  page: 0,
  error: null,
  isLoading: false
}

export function service(state = initState, action) {
  let index = -1
  let indexPaginate = -1

  switch (action.type) {
    case ServiceConstants.GET_SERVICES_REQUEST:
    case ServiceConstants.GET_SERVICES_PAGINATE_REQUEST:
    case ServiceConstants.CREATE_SERVICE_REQUEST:
    case ServiceConstants.EDIT_SERVICE_REQUEST:
    case ServiceConstants.DELETE_SERVICE_REQUEST:
    case ServiceConstants.IMPORT_SERVICES_REQUEST:
    case ServiceConstants.SEND_EMAIL_RESET_PASSWORD_SERVICE_REQUEST:
    case ServiceConstants.GET_SERVICES_FAILE:
    case ServiceConstants.GET_SERVICES_PAGINATE_FAILE:
    case ServiceConstants.CREATE_SERVICE_FAILE:
    case ServiceConstants.EDIT_SERVICE_FAILE:
    case ServiceConstants.DELETE_SERVICE_FAILE:
    case ServiceConstants.IMPORT_SERVICES_FAILE:
    case ServiceConstants.SEND_EMAIL_RESET_PASSWORD_SERVICE_FAILE:
    case ServiceConstants.SEND_EMAIL_RESET_PASSWORD_SERVICE_SUCCESS:
      return {
        ...state,
        isLoading: false
      }

    case ServiceConstants.GET_SERVICES_SUCCESS:
      return {
        ...state,
        list: action.payload,
        isLoading: false
      }
    case ServiceConstants.GET_SERVICES_PAGINATE_SUCCESS:
    case ServiceConstants.IMPORT_SERVICES_SUCCESS:
      return {
        ...state,
        listPaginate: action.payload.data,
        totalServices: action.payload.totalServices,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
        isLoading: false
      }

    case ServiceConstants.EDIT_SERVICE_SUCCESS:
      index = findIndex(state.list, action.payload._id)
      indexPaginate = findIndex(state.listPaginate, action.payload._id)

      if (index !== -1) {
        state.list[index] = action.payload
      }

      if (indexPaginate !== -1) {
        state.listPaginate[indexPaginate] = action.payload
      }

      return {
        ...state,
        isLoading: false
      }

    case ServiceConstants.CREATE_SERVICE_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
        listPaginate: [...state.listPaginate, action.payload],
        isLoading: false
      }

    case ServiceConstants.DELETE_SERVICE_SUCCESS:
      index = findIndex(state.list, action.payload)
      indexPaginate = findIndex(state.listPaginate, action.payload)

      if (index !== -1) {
        state.list.splice(index, 1)
      }

      if (indexPaginate !== -1) {
        state.listPaginate.splice(indexPaginate, 1)
      }

      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}
