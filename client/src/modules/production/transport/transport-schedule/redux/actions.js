import { transportScheduleConstants } from './constants';
import { transportScheduleServices } from './services';

export const transportScheduleActions = {
    createTransportSchedule,
}

// function getAllTransportRequirements(queryData) {
//     return (dispatch) => {
//         dispatch({
//             type: transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_REQUEST
//         });

//         transportRequirementsServices
//             .getAllTransportRequirements(queryData)
//             .then((res) => {
//                 dispatch({
//                     type: transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_SUCCESS,
//                     payload: res.data.content
//                 });
//             })
//             .catch((error) => {
//                 dispatch({
//                     type: transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_FAILURE,
//                     error
//                 });
//             });
//     }
// }

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