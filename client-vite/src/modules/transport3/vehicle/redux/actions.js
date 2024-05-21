import { vehicleConstants } from './constants';
import { vehicleServices } from './services';

export const vehicleActions = {
    getAllVehicle,
    deleteVehicles,
    createVehicle,
    editVehicle,
    getVehicleDetail,
    getAllVehicleWithCondition,
    getAllFreeVehicleSchedule,
    calculateVehiclesCost,
    getAllVehicleWithCostList,
    updateRealTimeVehicleStatus,
}

function getAllVehicle(queryData) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.GET_ALL_ONLY_VEHICLE_NAME_REQUEST
        });

        vehicleServices
            .getAllVehicle(queryData)
            .then((res) => {
                dispatch({
                    type: vehicleConstants.GET_ALL_ONLY_VEHICLE_NAME_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.GET_ALL_ONLY_VEHICLE_NAME_FAILURE,
                    error
                });
            });
    }
}

function deleteVehicles(data) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.DELETE_VEHICLE_REQUEST
        });

        vehicleServices
            .deleteVehicles(data)
            .then((res) => {
                dispatch({
                    type: vehicleConstants.DELETE_VEHICLE_SUCCESS,
                    payload: res.data.content,
                    vehicleIds: data.vehicleIds
                });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.DELETE_VEHICLE_FAILURE,
                    error
                });
            });
    }
}

function createVehicle(data) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.CREATE_VEHICLE_REQUEST
        });
        vehicleServices
            .createVehicle(data)
            .then((res) => {
                dispatch({
                    type: vehicleConstants.CREATE_VEHICLE_SUCCESS,
                    payload: res.data.content
                });
                const resData = res.data.content;
                const dataToExternalSystem = {
                    dxCode: resData._id,
                    name: resData.name,
                    available: true,
                    averageFeeTransport: resData.averageFeeTransport,
                    averageGasConsume: resData.averageGasConsume,
                    averageVelocity: (resData.minVelocity + resData.maxVelocity)/2,
                    goodGroupsCannotTransport: resData.goodGroupsCannotTransport,
                    maxLoadWeight: resData.tonnage,
                    vehicleCost: 200000,
                    gasPrice: 30000,
                    height: resData.height,
                    width: resData.width,
                    length: resData.depth,
                    maxCapacity: resData.height * resData.width * resData.depth,
                    maxVelocity: resData.maxVelocity,
                    minVelocity: resData.minVelocity,
                    type: resData.vehicleType
                }
                vehicleServices
                    .createVehicleExternalSystem(dataToExternalSystem)
                    .then((res) => {
                        console.log("new vehicle external system ok!");
                    })
                    .catch((error) => {
                    console.log("new vehicle failure", error);
                    });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.CREATE_VEHICLE_FAILURE,
                    error
                });
            });

    }
}

function editVehicle(id, data) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.EDIT_VEHICLE_REQUEST
        });
        vehicleServices
            .editVehicle(id, data)
            .then((res) => {
                dispatch({
                    type: vehicleConstants.EDIT_VEHICLE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.EDIT_VEHICLE_FAILURE,
                    error
                });
            });
    }
}

function getVehicleDetail(id) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.GET_VEHICLE_DETAIL_REQUEST
        });
        vehicleServices
            .getVehicleDetail(id)
            .then((res) => {
                dispatch({
                    type: vehicleConstants.GET_VEHICLE_DETAIL_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.GET_VEHICLE_DETAIL_FAILURE,
                    error
                });
            });
    }
}

function getAllVehicleWithCondition(queryData = {}) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.GET_ALL_VEHICLE_WITH_CONDITION_REQUEST
        });
        vehicleServices
            .getAllVehicleWithCondition(queryData)
            .then((res) => {
                dispatch({
                    type: vehicleConstants.GET_ALL_VEHICLE_WITH_CONDITION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.GET_ALL_VEHICLE_WITH_CONDITION_FAILURE,
                    error
                });
            });
    }
}

function getAllFreeVehicleSchedule(query = {}) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.GET_ALL_VEHICLE_SCHEDULE_REQUEST
        });
        vehicleServices
            .getAllFreeVehicleSchedule(query)
            .then((res) => {
                dispatch({
                    type: vehicleConstants.GET_ALL_VEHICLE_SCHEDULE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.GET_ALL_VEHICLE_SCHEDULE_FAILURE,
                    error
                });
            });
    }
}

function calculateVehiclesCost(data) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.CALCULATE_VEHICLES_COST_REQUEST
        });

        vehicleServices
            .calculateVehiclesCost(data)
            .then((res) => {
                dispatch({
                    type: vehicleConstants.CALCULATE_VEHICLES_COST_SUCCESS,
                    payload: res.data.content
                });
                const resData = res.data.content;
                let dataToExternalSystem = [];
                if (resData.length > 0) {
                    resData.forEach((vehicle) => {
                        dataToExternalSystem.push({
                            dxCode: vehicle._id,
                            averageFeeTransport: vehicle.averageFeeTransport,
                            vehicleCost: vehicle.vehicleCost,
                        })
                    })
                }
                vehicleServices
                    .editVehicleSyncExternalSystem(dataToExternalSystem)
                    .then((res) => {
                        console.log("update vehicle cost external system ok!");
                    })
                    .catch((error) => {
                    console.log("update vehicle cost to external system failure", error);
                    });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.CALCULATE_VEHICLES_COST_FAILURE,
                    error
                });
            });
    }
}

function getAllVehicleWithCostList() {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.GET_VEHICLES_COST_REQUEST
        });

        vehicleServices
            .getAllVehicleWithCostList()
            .then((res) => {
                dispatch({
                    type: vehicleConstants.GET_VEHICLES_COST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: vehicleConstants.GET_VEHICLES_COST_FAILURE,
                    error
                });
            });
    }
}

function updateRealTimeVehicleStatus(data) {
    return (dispatch) => {
        dispatch({
            type: vehicleConstants.UPDATE_REALTIME_VEHICLE_STATUS,
            payload: data
        });
    }
}