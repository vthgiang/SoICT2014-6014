import { transportRequirementsConstants } from './constants';
import { transportRequirementsServices } from './services';

export const transportRequirementsActions = {
    getAllTransportRequirements,
}

function getAllTransportRequirements(queryData) {
    return (dispatch) => {
        dispatch({
            type: transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_REQUEST
        });

        transportRequirementsServices
            .getAllTransportRequirements(queryData)
            .then((res) => {
                dispatch({
                    type: transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_FAILURE,
                    error
                });
            });
    }
}
