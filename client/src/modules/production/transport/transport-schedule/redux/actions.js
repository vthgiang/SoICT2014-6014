import { transportScheduleConstants } from './constants';
import { transportScheduleServices } from './services';

export const transportScheduleActions = {
    getTransportScheduleByPlanId,
    editTransportScheduleByPlanId,
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
