import { routeConstants } from './constants'

const initialState = {
  listVehicleTransporting: [],
  listOrderTransporting: [],
  isLoading: false
}

export function route(state = initialState, action) {
  switch (action.type) {
    case routeConstants.GET_ALL_VEHICLE_TRANSPORTING_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case routeConstants.GET_ALL_VEHICLE_TRANSPORTING_SUCCESS:
      return {
        ...state,
        listVehicleTransporting: action.payload,
        isLoading: false
      }
    case routeConstants.GET_ALL_VEHICLE_TRANSPORTING_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case routeConstants.GET_ALL_ORDER_TRANSPORTING_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case routeConstants.GET_ALL_ORDER_TRANSPORTING_SUCCESS:
      return {
        ...state,
        listOrderTransporting: action.payload,
        isLoading: false
      }
    case routeConstants.GET_ALL_ORDER_TRANSPORTING_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}
