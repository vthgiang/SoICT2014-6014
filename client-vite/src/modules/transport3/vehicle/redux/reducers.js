import { vehicleConstants } from './constants'

const initialState = {
  listVehicle: [],
  isLoading: false,
  error: null,
  totalList: 0
}

export function vehicle(state = initialState, action) {
  switch (action.type) {
    case vehicleConstants.GET_ALL_VEHICLE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case vehicleConstants.GET_ALL_VEHICLE_SUCCESS:
      return {
        ...state,
        listVehicle: action.payload.data,
        isLoading: false
      }
    case vehicleConstants.GET_ALL_VEHICLE_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false
      }
    default:
      return state
  }
}
