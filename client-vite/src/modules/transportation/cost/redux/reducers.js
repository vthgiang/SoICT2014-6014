import { TransportationCostManagementConstants } from './constants';

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
    vehicleCostList: [],
    shipperCostList: [],
    formula: "",
    isLoading: false,
    error: null,
    totalVehicleCostList: 0,
    totalShipperCostList: 0,
}

export function transportationCostManagement(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case TransportationCostManagementConstants.GET_ALL_VEHICLE_COST_REQUEST:
        case TransportationCostManagementConstants.CREATE_VEHICLE_COST_REQUEST:
        case TransportationCostManagementConstants.GET_COST_FORMULA_REQUEST:
        case TransportationCostManagementConstants.CREATE_COST_FORMULA_REQUEST:
        case TransportationCostManagementConstants.DELETE_VEHICLE_COST_REQUEST:
        case TransportationCostManagementConstants.UPDATE_VEHICLE_COST_REQUEST:
        case TransportationCostManagementConstants.CREATE_CREATE_OR_UPDATE_COST_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case TransportationCostManagementConstants.GET_ALL_VEHICLE_COST_FAILURE:
        case TransportationCostManagementConstants.CREATE_VEHICLE_COST_FAILURE:
        case TransportationCostManagementConstants.CREATE_COST_FORMULA_FAILURE:
        case TransportationCostManagementConstants.GET_COST_FORMULA_FAILURE:
        case TransportationCostManagementConstants.DELETE_VEHICLE_COST_FAILURE:
        case TransportationCostManagementConstants.UPDATE_VEHICLE_COST_FAILURE:
        case TransportationCostManagementConstants.CREATE_CREATE_OR_UPDATE_COST_FAILURE:
            return {
                ...state,
                isLoading: false
            }
        case TransportationCostManagementConstants.CREATE_VEHICLE_COST_SUCCESS:
            return {
                ...state,
                vehicleCostList: [...state.vehicleCostList, action.payload],
                isLoading: false
            }
        case TransportationCostManagementConstants.GET_ALL_VEHICLE_COST_SUCCESS:
            return {
                ...state,
                vehicleCostList: action.payload.data,
                isLoading: false
            }
        case TransportationCostManagementConstants.GET_COST_FORMULA_SUCCESS:
            return {
                ...state,
                formula: action.payload.data,
                isLoading: false
            }
        case TransportationCostManagementConstants.CREATE_COST_FORMULA_SUCCESS:
            return {
                ...state,
                formula: action.payload.data,
                isLoading: false
            }
        case TransportationCostManagementConstants.DELETE_VEHICLE_COST_SUCCESS:
            return {
                ...state,
                vehicleCostList: state.vehicleCostList.filter(vehicleCost => vehicleCost._id != action.payload.deletedVehicleCost),
                isLoading: false
            }
        case TransportationCostManagementConstants.UPDATE_VEHICLE_COST_SUCCESS:
            index = findIndex(state.vehicleCostList, action.payload?._id);
            if (index !== -1) {
                state.vehicleCostList[index] = action.payload
            }
            return {
                ...state,
                isLoading: false,
            }
        case TransportationCostManagementConstants.CREATE_CREATE_OR_UPDATE_COST_SUCCESS:
            index = findIndex(state.shipperCostList, action.payload?._id);
            if (index !== -1) {
                state.shipperCostList[index] = action.payload
            } else {
                state.shipperCostList.push(action.payload)
            }
            return {
                ...state,
                isLoading: false,
            }
        case TransportationCostManagementConstants.GET_ALL_SHIPPER_COST_SUCCESS:
            return {
                ...state,
                shipperCostList: action.payload.data,
                totalShipperCostList: action.payload?.totalShipperCostList ? action.payload.totalShipperCostList : 0,
                isLoading: false
            }
        default:
            return state
    }
}