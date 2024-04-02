import { TransportationCostManagementConstants } from './constants';
import { TransportationCostManagementServices } from './services';

export const TransportationCostManagementActions = {
    getAllVehicleCosts,
    getFormula,
    createVehicleCost,
    createOrUpdateVehicleCostFormula,
    deleteVehicleCost,
    updateVehicleCost,
    createOrUpdateShipperCost,
    getAllShipperCosts,
}

function getAllVehicleCosts(queryData) {
    return (dispatch) => {
        dispatch({
            type: TransportationCostManagementConstants.GET_ALL_VEHICLE_COST_REQUEST
        });

        TransportationCostManagementServices
            .getAllVehicleCosts(queryData)
            .then((res) => {
                dispatch({
                    type: TransportationCostManagementConstants.GET_ALL_VEHICLE_COST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: TransportationCostManagementConstants.GET_ALL_VEHICLE_COST_FAILURE,
                    error
                });
            });
    }
}

function getAllShipperCosts(queryData) {
    return (dispatch) => {
        dispatch({
            type: TransportationCostManagementConstants.GET_ALL_SHIPPER_COST_REQUEST
        });

        TransportationCostManagementServices
            .getAllShipperCosts(queryData)
            .then((res) => {
                dispatch({
                    type: TransportationCostManagementConstants.GET_ALL_SHIPPER_COST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: TransportationCostManagementConstants.GET_ALL_SHIPPER_COST_FAILURE,
                    error
                });
            });
    }
}

function createVehicleCost(data) {
    return (dispatch) => {
        dispatch({
            type: TransportationCostManagementConstants.CREATE_VEHICLE_COST_REQUEST
        });

        TransportationCostManagementServices
            .createVehicleCost(data)
            .then((res) => {
                dispatch({
                    type: TransportationCostManagementConstants.CREATE_VEHICLE_COST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: TransportationCostManagementConstants.CREATE_VEHICLE_COST_FAILURE,
                    error
                });
            });
    }
}

function createOrUpdateShipperCost(data) {
    return (dispatch) => {
        dispatch({
            type: TransportationCostManagementConstants.CREATE_CREATE_OR_UPDATE_COST_REQUEST
        });

        TransportationCostManagementServices
            .createOrUpdateShipperCost(data)
            .then((res) => {
                dispatch({
                    type: TransportationCostManagementConstants.CREATE_CREATE_OR_UPDATE_COST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: TransportationCostManagementConstants.CREATE_CREATE_OR_UPDATE_COST_FAILURE,
                    error
                });
            });
    }
}

function getFormula() {
    return (dispatch) => {
        dispatch({
            type: TransportationCostManagementConstants.GET_COST_FORMULA_REQUEST
        });

        TransportationCostManagementServices
            .getFormula()
            .then((res) => {
                dispatch({
                    type: TransportationCostManagementConstants.GET_COST_FORMULA_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: TransportationCostManagementConstants.GET_COST_FORMULA_FAILURE,
                    error
                });
            });
    }
}

function createOrUpdateVehicleCostFormula(data) {
    return (dispatch) => {
        dispatch({
            type: TransportationCostManagementConstants.CREATE_COST_FORMULA_REQUEST
        });

        TransportationCostManagementServices
            .createOrUpdateVehicleCostFormula(data)
            .then((res) => {
                dispatch({
                    type: TransportationCostManagementConstants.CREATE_COST_FORMULA_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: TransportationCostManagementConstants.CREATE_COST_FORMULA_FAILURE,
                    error
                });
            });
    }
}

function deleteVehicleCost(id) {
    return (dispatch) => {
        dispatch({
            type: TransportationCostManagementConstants.DELETE_VEHICLE_COST_REQUEST
        });

        TransportationCostManagementServices
            .deleteVehicleCost(id)
            .then((res) => {
                dispatch({
                    type: TransportationCostManagementConstants.DELETE_VEHICLE_COST_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((error) => {
                dispatch({
                    type: TransportationCostManagementConstants.DELETE_VEHICLE_COST_FAILURE,
                    error
                });
            });
    }
}

function updateVehicleCost(id, data) {
    return (dispatch) => {
        dispatch({
            type: TransportationCostManagementConstants.UPDATE_VEHICLE_COST_REQUEST
        });
        TransportationCostManagementServices
            .updateVehicleCost(id, data)
            .then((res) => {
                dispatch({
                    type: TransportationCostManagementConstants.UPDATE_VEHICLE_COST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: TransportationCostManagementConstants.UPDATE_VEHICLE_COST_FAILURE,
                    error
                });
            });
    }
}