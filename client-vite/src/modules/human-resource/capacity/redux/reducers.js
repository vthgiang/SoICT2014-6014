import { CapacityConstant } from "./constants";


const initState = {
  isLoading: false,
  totalList: 0,
  listCapacity: [],
  error: ''
}

const findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

export function capacity(state = initState, action) {
  switch (action.type) {
    case CapacityConstant.GET_CAPACITY_LIST_REQUEST: 
    case CapacityConstant.ADD_CAPACITY_REQUEST: 
    case CapacityConstant.EDIT_CAPACITY_REQUEST: 
    case CapacityConstant.DELETE_CAPACITY_REQUEST: 
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
    case CapacityConstant.ADD_CAPACITY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        listCapacity: [action.payload, ...state.listCapacity]
      }
    }
      
    case CapacityConstant.EDIT_CAPACITY_SUCCESS: {
      let index = findIndex(state?.listCapacity, action.payload._id)
      if (index !== -1) {
        state.listCapacity[index] = action.payload
      }
      return {
        ...state,
        isLoading: false
      }
    }
      
    case CapacityConstant.DELETE_CAPACITY_SUCCESS: {
      let index = findIndex(state?.listCapacity, action.payload._id)
      if (index !== -1) {
        state.listCapacity.splice(index, 1)
      }
      return {
        ...state,
        isLoading: false
      }
    }
    
    case CapacityConstant.GET_CAPACITY_LIST_FAILURE: 
    case CapacityConstant.ADD_CAPACITY_FAILURE: 
    case CapacityConstant.EDIT_CAPACITY_FAILURE: 
    case CapacityConstant.DELETE_CAPACITY_FAILURE: 
      return {
        ...state,
        isLoading: false,
      }
    
    default:
      return state
  }
}
