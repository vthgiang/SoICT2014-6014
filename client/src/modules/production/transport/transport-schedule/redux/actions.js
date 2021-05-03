import { transportScheduleConstants } from './constants';
import { transportScheduleServices } from './services';

export const transportScheduleActions = {
    getTransportScheduleByPlanId,
    editTransportScheduleByPlanId,
    changeTransportRequirementProcess,
    getTransportScheduleByCarrierId,
    driverSendMessage,
    changeTransportStatusByCarrierId,
}

function getTransportScheduleByPlanId(id) {
    return dispatch => {
        dispatch({
            type: transportScheduleConstants.GET_TRANSPORT_SCHEDULE_BY_PLAN_ID_REQUEST
        });
        transportScheduleServices.getTransportScheduleByPlanId(id)
            .then((res) => {
                dispatch({
                    type: transportScheduleConstants.GET_TRANSPORT_SCHEDULE_BY_PLAN_ID_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: transportScheduleConstants.GET_TRANSPORT_SCHEDULE_BY_PLAN_ID_FAILURE,
                    error
                });
            });
    }
}
/**
 * Edit transportSchedule có transportPlan === planid
 * @param {*} planId 
 * @param {*} data 
 * @returns 
 */
function editTransportScheduleByPlanId(planId, data) {
    return (dispatch) => {
        dispatch({
            type: transportScheduleConstants.EDIT_TRANSPORT_SCHEDULE_BY_PLAN_ID_REQUEST
        });
        transportScheduleServices
            .editTransportScheduleByPlanId(planId, data)
            .then((res) => {
                dispatch({
                    type: transportScheduleConstants.EDIT_TRANSPORT_SCHEDULE_BY_PLAN_ID_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportScheduleConstants.EDIT_TRANSPORT_SCHEDULE_BY_PLAN_ID_FAILURE,
                    error
                });
            });
    }
}

function changeTransportRequirementProcess(data){
    return (dispatch) => {
        dispatch({
            type: transportScheduleConstants.CHANGE_TRANSPORT_REQUIREMENT_PROCESS_REQUEST
        });
        transportScheduleServices
            .changeTransportRequirementProcess(data)
            .then((res) => {
                dispatch({
                    type: transportScheduleConstants.CHANGE_TRANSPORT_REQUIREMENT_PROCESS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportScheduleConstants.CHANGE_TRANSPORT_REQUIREMENT_PROCESS_FAILURE,
                    error
                });
            });
    }
}

function driverSendMessage(data){
    return (dispatch) => {
        dispatch({
            type: transportScheduleConstants.DRIVER_SEND_MESSAGE_REQUEST
        });
        transportScheduleServices.driverSendMessage(data)
        .then((res) => {
            dispatch({
                type: transportScheduleConstants.DRIVER_SEND_MESSAGE_SUCCESS,
                payload: res.data.content
            });
        })
        .catch((error) => {
            dispatch({
                type: transportScheduleConstants.DRIVER_SEND_MESSAGE_FAILURE,
                error
            });
        });
    }
}

function getTransportScheduleByCarrierId(carrierId) {
    return dispatch => {
        dispatch({
            type: transportScheduleConstants.GET_ALL_TRANSOPRT_SCHEDULE_ROUTE_BY_CARRIER_ID_REQUEST
        });
        transportScheduleServices.getTransportScheduleByCarrierId(carrierId)
            .then((res) => {
                dispatch({
                    type: transportScheduleConstants.GET_ALL_TRANSOPRT_SCHEDULE_ROUTE_BY_CARRIER_ID_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: transportScheduleConstants.GET_ALL_TRANSOPRT_SCHEDULE_ROUTE_BY_CARRIER_ID_FAILURE,
                    error
                });
            });
    }
}

function changeTransportStatusByCarrierId(carrierId, data) {
    return dispatch => {
        dispatch({
            type: transportScheduleConstants.CHANGE_TRANSPORT_STATUS_BY_CARRIER_ID_REQUEST
        });
        transportScheduleServices.changeTransportStatusByCarrierId(carrierId, data)
            .then((res) => {
                dispatch({
                    type: transportScheduleConstants.CHANGE_TRANSPORT_STATUS_BY_CARRIER_ID_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: transportScheduleConstants.CHANGE_TRANSPORT_STATUS_BY_CARRIER_ID_FAILURE,
                    error
                });
            });
    }
}
