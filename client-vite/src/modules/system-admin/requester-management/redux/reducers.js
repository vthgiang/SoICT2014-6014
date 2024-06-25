import { RequesterConstants } from './constants'

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

export function requester(state = initState, action) {
  let index = -1
  let indexPaginate = -1
  switch (action.type) {
    case RequesterConstants.GET_REQUESTERS_REQUEST:
    case RequesterConstants.GET_REQUESTERS_PAGINATE_REQUEST:
    case RequesterConstants.SHOW_REQUESTER_REQUEST:
    case RequesterConstants.CREATE_REQUESTER_REQUEST:
    case RequesterConstants.EDIT_REQUESTER_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case RequesterConstants.GET_REQUESTERS_SUCCESS:
      return {
        ...state,
        list: action.payload,
        isLoading: false
      }

    case RequesterConstants.GET_REQUESTERS_PAGINATE_SUCCESS:
      return {
        ...state,
        listPaginate: action.payload.data,
        totalRequesters: action.payload.totalRequesters,
        totalPages: action.payload.totalPages,
        isLoading: false
      }

    case RequesterConstants.SHOW_REQUESTER_SUCCESS:
      return {
        ...state,
        item: action.payload,
        isLoading: false
      }

    case RequesterConstants.CREATE_REQUESTER_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
        listPaginate: [...state.listPaginate, action.payload],
        isLoading: false
      }

    case RequesterConstants.EDIT_REQUESTER_SUCCESS:
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

    case RequesterConstants.GET_REQUESTERS_FAILE:
    case RequesterConstants.GET_REQUESTERS_PAGINATE_FAILE:
    case RequesterConstants.SHOW_REQUESTER_FAILE:
    case RequesterConstants.CREATE_REQUESTER_FAILE:
    case RequesterConstants.EDIT_REQUESTER_FAILE:
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
