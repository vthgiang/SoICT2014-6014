import { transportVehicleConstants } from './constants';
const initialState = {
    lists: [],
    isLoading: true,
}
var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}
export function transportVehicle(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_REQUEST:
        case transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_REQUEST:
        case transportVehicleConstants.CREATE_TRANSPORT_PLAN_VEHICLE_NOT_DUPLICATE_REQUEST:
        case transportVehicleConstants.EDIT_TRANSPORT_VEHICLE_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
        case transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_FAILURE:
        case transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_FAILURE:    
        case transportVehicleConstants.CREATE_TRANSPORT_PLAN_VEHICLE_NOT_DUPLICATE_FAILURE: 
        case transportVehicleConstants.EDIT_TRANSPORT_VEHICLE_FAILURE:   
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
        case transportVehicleConstants.EDIT_TRANSPORT_VEHICLE_SUCCESS:
            index = findIndex(state.lists, action.payload._id);
            if (index !== -1) {
                state.lists[index] = action.payload
            }
            return {
                ...state,
                isLoading: false
            }
        case transportVehicleConstants.CREATE_TRANSPORT_PLAN_VEHICLE_NOT_DUPLICATE_SUCCESS:
            index = findIndex(state.lists, action.payload._id);
            if (index !== -1) {
                state.lists[index] = action.payload
            }
            else{
                state.lists.push(action.payload)
            }
            return {
                ...state,
                isLoading: false
            }
		default:
            		return state
}
}
