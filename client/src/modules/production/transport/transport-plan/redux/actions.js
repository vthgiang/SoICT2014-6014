import { transportScheduleConstants } from './constants';
import { transportScheduleServices } from './services';

export const transportScheduleActions = {
    getAllTransportSchedules,
    createTransportSchedule,
}

function getAllTransportSchedules(queryData) {
    return (dispatch) => {
        dispatch({
            type: transportScheduleConstants.GET_ALL_TRANSPORT_SCHEDULES_REQUEST
        });

        transportScheduleServices
            .getAllTransportSchedules(queryData)
            .then((res) => {
                dispatch({
                    type: transportScheduleConstants.GET_ALL_TRANSPORT_SCHEDULES_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportScheduleConstants.GET_ALL_TRANSPORT_SCHEDULES_FAILURE,
                    error
                });
            });
    }
}

function createTransportSchedule(data) {
    return (dispatch) => {
        dispatch({
            type: transportScheduleConstants.CREATE_TRANSPORT_SCHEDULE_REQUEST
        });
        transportScheduleServices
            .createTransportSchedule(data)
            .then((res) => {
                dispatch({
                    type: transportScheduleConstants.CREATE_TRANSPORT_SCHEDULE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportScheduleConstants.CREATE_TRANSPORT_SCHEDULE_FAILURE,
                    error
                });
            });
    }
}