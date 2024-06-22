import { ResourceConstants } from './constants'

const findIndex = (array, id) => {
  let result = -1
  array.forEach((value, index) => {
    if (value.id === id) {
      result = index
    }
  })
  return result
}

const initState = {
  list: [],
  listPaginate: [],
  totalResources: 0,
  totalPages: 0,
  error: null,
  isLoading: false,
  item: null
}

export function resource(state = initState, action) {
  let index = -1
  let indexPaginate = -1
  switch (action.type) {
    case ResourceConstants.GET_RESOURCES_REQUEST:
    case ResourceConstants.GET_RESOURCES_PAGINATE_REQUEST:
    case ResourceConstants.GET_RESOURCE_BY_ID_REQUEST:
    case ResourceConstants.CREATE_RESOURCE_REQUEST:
    case ResourceConstants.EDIT_RESOURCE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ResourceConstants.GET_RESOURCES_SUCCESS:
      return {
        ...state,
        list: action.payload,
        isLoading: false
      }

    case ResourceConstants.GET_RESOURCES_PAGINATE_SUCCESS:
      return {
        ...state,
        listPaginate: action.payload.data,
        totalResources: action.payload.totalResources,
        totalPages: action.payload.totalPages,
        isLoading: false
      }

    case ResourceConstants.GET_RESOURCE_BY_ID_SUCCESS:
      return {
        ...state,
        item: action.payload,
        isLoading: false
      }

    case ResourceConstants.CREATE_RESOURCE_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
        listPaginate: [...state.listPaginate, action.payload],
        isLoading: false
      }

    case ResourceConstants.EDIT_RESOURCE_SUCCESS:
      index = findIndex(state.list, action.payload.id)
      indexPaginate = findIndex(state.listPaginate, action.payload.id)
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

    case ResourceConstants.GET_RESOURCES_FAILE:
    case ResourceConstants.GET_RESOURCES_PAGINATE_FAILE:
    case ResourceConstants.GET_RESOURCE_BY_ID_FAILE:
    case ResourceConstants.CREATE_RESOURCE_FAILE:
    case ResourceConstants.EDIT_RESOURCE_FAILE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return initState

    default:
      return state
  }
}
