import { transportScheduleConstants } from './constants';
import { transportScheduleServices } from './services';

export const transportScheduleActions = {
    getTransportScheduleByPlanId,
}

function getTransportScheduleByPlanId(id) {
    return dispatch => {
        dispatch({
            type: transportScheduleConstants.GET_TRANSPORT_SCHEDULE_BY_PLAN_ID_REQUEST
        });
        transportScheduleServices.getTransportScheduleByPlanId(id)
            .then((res) => {
                console.log(res.data.content);
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

// function editTransportRequirement(id, data) {
//     return (dispatch) => {
//         dispatch({
//             type: transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_REQUEST
//         });
//         transportRequirementsServices
//             .editTransportRequirement(id, data)
//             .then((res) => {
//                 dispatch({
//                     type: transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_SUCCESS,
//                     payload: res.data.content
//                 });
//             })
//             .catch((error) => {
//                 dispatch({
//                     type: transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_FAILURE,
//                     error
//                 });
//             });
//     }
// }
