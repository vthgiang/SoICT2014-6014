import { CapacityConstant } from "./constants";


const initState = {
  isLoading: false,
  totalList: 0,
  listCapacity: [],
  error: ''
}

export function capacity(state = initState, action) {
  switch (action.type) {
    case CapacityConstant.GET_CAPACITY_LIST_REQUEST: 
      return {
        ...state,
        isLoading: true
      }
    
    case CapacityConstant.GET_CAPACITY_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listCapacity: action.payload.listCapacity !== undefined ? action.payload.listCapacity : [],
        totalList: action.payload.totalList
      }
    
    case CapacityConstant.GET_CAPACITY_LIST_FAILURE: 
      return {
        ...state,
        isLoading: false,
        listCapacity: action.payload !== undefined ? action.payload : []
      }
    
    default:
      return state
  }
}