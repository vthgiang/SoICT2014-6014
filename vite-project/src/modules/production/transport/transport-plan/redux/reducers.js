import { transportPlanConstants } from './constants'

var findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initialState = {
  lists: [],
  isLoading: false
}
export function transportPlan(state = initialState, action) {
  let index = -1
  switch (action.type) {
    case transportPlanConstants.GET_ALL_TRANSPORT_PLANS_REQUEST:
    case transportPlanConstants.CREATE_TRANSPORT_PLAN_REQUEST:
    case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_REQUEST:
    case transportPlanConstants.EDIT_TRANSPORT_PLAN_REQUEST:
    case transportPlanConstants.ADD_TRANSPORT_REQUIREMENT_TO_PLAN_REQUEST:
    case transportPlanConstants.ADD_TRANSPORT_VEHICLE_TO_PLAN_REQUEST:
    case transportPlanConstants.DELETE_TRANSPORT_PLAN_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case transportPlanConstants.GET_ALL_TRANSPORT_PLANS_FAILURE:
    case transportPlanConstants.CREATE_TRANSPORT_PLAN_FAILURE:
    case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_FAILURE:
    case transportPlanConstants.EDIT_TRANSPORT_PLAN_FAILURE:
    case transportPlanConstants.ADD_TRANSPORT_REQUIREMENT_TO_PLAN_FAILURE:
    case transportPlanConstants.ADD_TRANSPORT_VEHICLE_TO_PLAN_FAILURE:
    case transportPlanConstants.DELETE_TRANSPORT_PLAN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case transportPlanConstants.GET_ALL_TRANSPORT_PLANS_SUCCESS:
      return {
        ...state,
        lists: action.payload.data,
        totalList: action.payload.totalList,
        isLoading: false
      }
    case transportPlanConstants.CREATE_TRANSPORT_PLAN_SUCCESS:
      return {
        ...state,
        lists: [...state.lists, action.payload],
        isLoading: false
      }

    case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentTransportPlan: action.payload
      }

    case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_2_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentTransportPlan2: action.payload
      }

    case transportPlanConstants.EDIT_TRANSPORT_PLAN_SUCCESS:
    case transportPlanConstants.ADD_TRANSPORT_REQUIREMENT_TO_PLAN_SUCCESS:
    case transportPlanConstants.ADD_TRANSPORT_VEHICLE_TO_PLAN_SUCCESS:
      index = findIndex(state.lists, action.payload._id)
      if (index !== -1) {
        state.lists[index] = action.payload
      }
      return {
        ...state,
        isLoading: false
      }
    case transportPlanConstants.DELETE_TRANSPORT_PLAN_SUCCESS:
      return {
        ...state,
        lists: state.lists.filter((transportPlan) => transportPlan?._id !== action.payload?._id),
        isLoading: false
      }
    default:
      return state
  }
}
