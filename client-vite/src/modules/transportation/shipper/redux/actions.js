import { ShipperConstants } from './constants';
import { ShipperServices } from './services';

export const ShipperActions = {
    editDriverInfo,
    getAllShipperWithCondition,
    getAllFreeShipperSchedule,
    getTasksForShipper,
    createShipper,
    getAllShipperAvailableForJourney,
    getAllDriversNotConfirm,
    calculateShipperSalary,
    saveShipperSalary,
    getAllShipperSalaryByCondition,
    updateRealTimeShipperStatus
}

function createShipper(data) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.CREATE_SHIPPER_REQUEST
        });
        ShipperServices
            .createShipper(data)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.CREATE_SHIPPER_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.CREATE_SHIPPER_FAILURE,
                    error
                });
            });
    }
}

function saveShipperSalary(data) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.SAVE_SHIPPER_SALARY_REQUEST
        });
        ShipperServices
            .saveShippersSalary(data)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.SAVE_SHIPPER_SALARY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.SAVE_SHIPPER_SALARY_FAILURE,
                    error
                });
            });
    }
}

function getTasksForShipper(query) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.GET_ALL_SHIPPER_TASK_REQUEST
        });
        ShipperServices
            .getTasksForShipper(query)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_TASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_TASK_FAILURE,
                    error
                });
            });
    }
}

function getAllShipperSalaryByCondition(query) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.GET_ALL_SHIPPER_SALARY_REQUEST
        });
        ShipperServices
            .getAllShipperSalaryByCondition(query)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_SALARY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_SALARY_FAILURE,
                    error
                });
            });
    }
}

function calculateShipperSalary(query) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.CALCULATE_SHIPPER_SALARY_REQUEST
        });
        ShipperServices
            .calculateShipperSalary(query)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.CALCULATE_SHIPPER_SALARY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.CALCULATE_SHIPPER_SALARY_FAILURE,
                    error
                });
            });
    }
}

function editDriverInfo(id, data) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.EDIT_SHIPPER_REQUEST
        });
        ShipperServices
            .editDriverInfo(id, data)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.EDIT_SHIPPER_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.EDIT_SHIPPER_FAILURE,
                    error
                });
            });
    }
}

function getAllShipperWithCondition(queryData) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.GET_ALL_SHIPPER_WITH_CONDITION_REQUEST
        });
        ShipperServices
            .getAllShipperWithCondition(queryData)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_WITH_CONDITION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_WITH_CONDITION_FAILURE,
                    error
                });
            });
    }
}

function getAllDriversNotConfirm(queryData) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.GET_ALL_SHIPPER_NOT_CONFIRM_REQUEST
        });
        ShipperServices
            .getAllDriversNotConfirm(queryData)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_NOT_CONFIRM_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_NOT_CONFIRM_FAILURE,
                    error
                });
            });
    }
}

function getAllFreeShipperSchedule(query = {}) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.GET_ALL_SHIPPER_SCHEDULE_REQUEST
        });
        ShipperServices
            .getAllFreeShipperSchedule(query)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_SCHEDULE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.GET_ALL_SHIPPER_SCHEDULE_FAILURE,
                    error
                });
            });
    }
}

function getAllShipperAvailableForJourney(query) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.GET_SHIPPER_FREE_FOR_JOURNEY_REQUEST
        });
        ShipperServices
            .getAllShipperAvailableForJourney(query)
            .then((res) => {
                dispatch({
                    type: ShipperConstants.GET_SHIPPER_FREE_FOR_JOURNEY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: ShipperConstants.GET_SHIPPER_FREE_FOR_JOURNEY_FAILURE,
                    error
                });
            });
    }
}

function updateRealTimeShipperStatus(data) {
    return (dispatch) => {
        dispatch({
            type: ShipperConstants.UPDATE_REALTIME_SHIPPER_STATUS,
            payload: data
        });
    }
}