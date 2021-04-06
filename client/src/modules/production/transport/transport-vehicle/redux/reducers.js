import { transportVehicleConstants } from './constants';
const initialState = {
    lists: [],
    isLoading: true,
}
export function transportVehicle(state = initialState, action) {
switch (action.type) {
        case transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_REQUEST:
        case transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
        case transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_FAILURE:
        case transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_FAILURE:        
            return {
                    ...state,
                    isLoading: false,
                    error: action.error
                }
        case transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_SUCCESS:
            return {
                    ...state,
                    lists: action.payload.data,
                    isLoading: false
                }
        case transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
		default:
            		return state
}
}
