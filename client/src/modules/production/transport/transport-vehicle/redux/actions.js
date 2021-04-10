import { transportVehicleConstants } from './constants';
import { transportVehicleServices } from './services';

export const transportVehicleActions = {
    createTransportVehicle,
    getAllTransportVehicles,
    createTransportPlanVehicleNotDuplicate,
}

function getAllTransportVehicles(queryData) {
    return (dispatch) => {
        dispatch({
            type: transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_REQUEST
        });

        transportVehicleServices
            .getAllTransportVehicles(queryData)
            .then((res) => {
                dispatch({
                    type: transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportVehicleConstants.GET_ALL_TRANSPORT_VEHICLES_FAILURE,
                    error
                });
            });
    }
}

function createTransportVehicle(data) {
    return (dispatch) => {
        dispatch({
            type: transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_REQUEST
        });
        transportVehicleServices
            .createTransportVehicle(data)
            .then((res) => {
                dispatch({
                    type: transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_FAILURE,
                    error
                });
            });
    }
}

function createTransportPlanVehicleNotDuplicate(id, data) {
    return (dispatch) => {
        dispatch({
            type: transportVehicleConstants.CREATE_TRANSPORT_VEHICLE_REQUEST
        });
        transportVehicleServices
            .createTransportPlanVehicleNotDuplicate(id, data)
            .then((res) => {
                dispatch({
                    type: transportVehicleConstants.CREATE_TRANSPORT_PLAN_VEHICLE_NOT_DUPLICATE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportVehicleConstants.CREATE_TRANSPORT_PLAN_VEHICLE_NOT_DUPLICATE_FAILURE,
                    error
                });
            });
    }
}