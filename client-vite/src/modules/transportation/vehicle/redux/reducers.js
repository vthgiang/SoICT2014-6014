import { vehicleConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    listVehicle: [],
    vehicleWithCosts: [],
    todayVehiclesSchedule: [],
    isLoading: false,
    error: null,
    totalList: 0,
}

export function vehicle(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case vehicleConstants.GET_ALL_ONLY_VEHICLE_NAME_REQUEST:
        case vehicleConstants.DELETE_VEHICLE_REQUEST:
        case vehicleConstants.CREATE_VEHICLE_REQUEST:
        case vehicleConstants.EDIT_VEHICLE_REQUEST:
        case vehicleConstants.GET_VEHICLE_DETAIL_REQUEST:
        case vehicleConstants.GET_ALL_VEHICLE_WITH_CONDITION_REQUEST:
        case vehicleConstants.GET_ALL_VEHICLE_SCHEDULE_REQUEST:
        case vehicleConstants.GET_VEHICLES_COST_REQUEST:
        case vehicleConstants.CALCULATE_VEHICLES_COST_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case vehicleConstants.GET_ALL_ONLY_VEHICLE_NAME_FAILURE:
        case vehicleConstants.DELETE_VEHICLE_FAILURE:
        case vehicleConstants.CREATE_VEHICLE_FAILURE:
        case vehicleConstants.EDIT_VEHICLE_FAILURE:
        case vehicleConstants.GET_ALL_VEHICLE_WITH_CONDITION_FAILURE:
        case vehicleConstants.GET_ALL_VEHICLE_SCHEDULE_FAILURE:
        case vehicleConstants.GET_VEHICLES_COST_FAILURE:
        case vehicleConstants.CALCULATE_VEHICLES_COST_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        // Danh sách toàn bộ xe
        case vehicleConstants.GET_ALL_ONLY_VEHICLE_NAME_SUCCESS:
            return {
                ...state,
                listVehicle: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case vehicleConstants.GET_VEHICLES_COST_SUCCESS:
            return {
                ...state,
                vehicleWithCosts: action.payload.data,
                isLoading: false
            }
        case vehicleConstants.GET_ALL_VEHICLE_WITH_CONDITION_SUCCESS:
            return {
                ...state,
                listVehicle: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case vehicleConstants.DELETE_VEHICLE_SUCCESS:
            return {
                ...state,
                listVehicle: state.listVehicle.filter(vehicle => !action.vehicleIds.includes(vehicle?._id)),
                isLoading: false
            }
        case vehicleConstants.CREATE_VEHICLE_SUCCESS:
            return {
                ...state,
                listVehicle: [
                    ...state.listVehicle,
                    action.payload
                ],
                isLoading: false
            }
        case vehicleConstants.EDIT_VEHICLE_SUCCESS:
            index = findIndex(state.listVehicle, action.payload?._id);
            if (index !== -1) {
                state.listVehicle[index] = action.payload
            }
            return {
                ...state,
                isLoading: false
            }
        case vehicleConstants.GET_VEHICLE_DETAIL_SUCCESS:
            return {
                ...state,
                currentDetailVehicle: action.payload,
                isLoading: false
            }
        case vehicleConstants.GET_ALL_VEHICLE_SCHEDULE_SUCCESS: {
            return {
                ...state,
                todayVehiclesSchedule: action.payload,
                isLoading: false
            }
        }
        case vehicleConstants.CALCULATE_VEHICLES_COST_SUCCESS: {
            return {
                ...state,
                listVehicle: action.payload,
                isLoading: false
            }
        }
        case vehicleConstants.UPDATE_REALTIME_VEHICLE_STATUS: {
            let listVehicleUpdate = state.listVehicle;
            console.log("Vehicle", action.payload);
            let updateData = action.payload;
            let index = listVehicleUpdate.findIndex((vehicle) => vehicle._id == updateData.vehicleId);
            if (index != -1) {
                listVehicleUpdate[index].status = updateData.status
            }
            return {
                ...state,
                listVehicle: listVehicleUpdate
            }
        }
        default:
            return state
    }
}