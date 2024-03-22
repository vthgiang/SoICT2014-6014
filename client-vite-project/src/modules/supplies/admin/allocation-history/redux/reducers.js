import { AllocationHistoryConstants } from './constants'

const initState = {
  isLoading: false,
  totalList: 0,
  error: '',
  listAllocation: [],
  allocation: {}
}

export function allocationHistoryReducer(state = initState, action) {
  switch (action.type) {
    case AllocationHistoryConstants.SEARCH_ALLOCATION_REQUEST:
    case AllocationHistoryConstants.SEARCH_ALLOCATION_SUCCESS:
      if (action.payload !== undefined) {
        return {
          ...state,
          listAllocation: action.payload.data,
          totalList: action.payload.totalList,
          isLoading: false
        }
      } else {
        return { ...state }
      }
    case AllocationHistoryConstants.SEARCH_ALLOCATION_FAILURE:

    case AllocationHistoryConstants.CREATE_ALLOCATIONS_REQUEST:

    case AllocationHistoryConstants.CREATE_ALLOCATIONS_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          isLoading: false,
          listAllocation: [...action.payload.allocations, ...state.listAllocation]
        }
      } else {
        return { ...state, isLoading: false }
      }

    case AllocationHistoryConstants.CREATE_ALLOCATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        allocationCodeError: action.payload
      }

    case AllocationHistoryConstants.UPDATE_ALLOCATION_REQUEST:
    case AllocationHistoryConstants.UPDATE_ALLOCATION_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          isLoading: false,
          listAllocation: [...action.payload, state.listAllocation.filter((item) => item._id !== action.payload._id)]
        }
      } else {
        return { ...state, isLoading: false }
      }

    case AllocationHistoryConstants.UPDATE_ALLOCATION_FAILURE:
      return {
        ...state,
        isLoading: false
      }

    case AllocationHistoryConstants.DELETE_ALLOCATIONS_REQUEST:
      return {
        ...state,
        isLoading: true,
        allocationCodeError: []
      }
    case AllocationHistoryConstants.DELETE_ALLOCATIONS_SUCCESS:
      return {
        ...state,
        listAllocation: state.listAllocation.filter((allocation) => !action.ids.includes(allocation?._id)),
        isLoading: false
      }
    case AllocationHistoryConstants.DELETE_ALLOCATIONS_FAILURE:

    case AllocationHistoryConstants.GET_ALLOCATION_BY_ID_REQUEST:
    case AllocationHistoryConstants.GET_ALLOCATION_BY_ID_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          isLoading: false,
          allocation: action.payload.allocation
        }
      } else {
        return { ...state, isLoading: false }
      }
    case AllocationHistoryConstants.GET_ALLOCATION_BY_ID_FAILURE:

    default:
      return state
  }
}
