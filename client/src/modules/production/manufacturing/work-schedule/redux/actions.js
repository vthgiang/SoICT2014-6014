import { workScheduleConstants } from "./constants";
import { workScheduleSevices } from "./services";

export const workScheduleActions = {
    getAllWorkSchedules,
    createWorkSchedule,
    setCurrentMonth,
    getAllWorkSchedulesWorker,
    getAllWorkSchedulesByMillId,
}


function getAllWorkSchedules(query) {
    return dispatch => {
        dispatch({
            type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_REQUEST
        });
        workScheduleSevices.getAllWorkSchedules(query)
            .then((res) => {
                dispatch({
                    type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_FAILURE,
                    error
                });
            });
    }
}

function createWorkSchedule(data) {
    return dispatch => {
        dispatch({
            type: workScheduleConstants.CREATE_WORK_SCHEDULE_REQUEST
        });
        workScheduleSevices.createWorkSchedule(data)
            .then((res) => {
                dispatch({
                    type: workScheduleConstants.CREATE_WORK_SCHEDULE_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: workScheduleConstants.CREATE_WORK_SCHEDULE_FAILURE,
                    error
                });
            });
    }
}

function setCurrentMonth(month) {
    return dispatch => {
        dispatch({
            type: workScheduleConstants.SET_CURRENT_MONTH,
            payload: month
        });
    }
}

function getAllWorkSchedulesWorker(query) {
    return dispatch => {
        dispatch({
            type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_WORKER_REQUEST
        });
        workScheduleSevices.getAllWorkSchedules(query)
            .then((res) => {
                dispatch({
                    type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_WORKER_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_WORKER_FAILURE,
                    error
                });
            });
    }
}

function getAllWorkSchedulesByMillId(id) {
    return dispatch => {
        dispatch({
            type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_BY_MILL_ID_REQUEST
        });
        workScheduleSevices.getAllWorkSchedulesByMillId(id)
            .then((res) => {
                dispatch({
                    type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_BY_MILL_ID_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: workScheduleConstants.GET_ALL_WORK_SCHEDULE_BY_MILL_ID_FAILURE,
                    error
                });
            });
    }
}