import { transportRequirementsConstants } from './constants';
import { transportRequirementsServices } from './services';

export const transportRequirementsActions = {
    getAllTransportRequirements,
    createTransportRequirement,
    editTransportRequirement,
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

function createTransportRequirement(data) {
    return (dispatch) => {
        dispatch({
            type: transportRequirementsConstants.CREATE_TRANSPORT_REQUIREMENT_REQUEST
        });
        transportRequirementsServices
            .createTransportRequirement(data)
            .then((res) => {
                dispatch({
                    type: transportRequirementsConstants.CREATE_TRANSPORT_REQUIREMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportRequirementsConstants.CREATE_TRANSPORT_REQUIREMENT_FAILURE,
                    error
                });
            });
    }
}

function editTransportRequirement(id, data) {
    return (dispatch) => {
        dispatch({
            type: transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_REQUEST
        });
        transportRequirementsServices
            .editTransportRequirement(id, data)
            .then((res) => {
                dispatch({
                    type: transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_FAILURE,
                    error
                });
            });
    }
}