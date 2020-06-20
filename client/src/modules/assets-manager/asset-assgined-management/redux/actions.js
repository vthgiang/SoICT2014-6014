import {IncidentService} from './services';
import {IncidentConstants} from './constants';

export const IncidentActions = {
    createIncident,
    updateIncident,
    deleteIncident
}

function createIncident(id, data) {
    return async dispatch => {
        try {
            dispatch({
                type: IncidentConstants.CREATE_INCIDENT_REQUEST
            });
            const response = await IncidentService.createIncident(id, data);
            dispatch({
                type: IncidentConstants.CREATE_INCIDENT_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: IncidentConstants.CREATE_INCIDENT_FAILURE,
                error: err
            });
        }

    };
}

function updateIncident(id, data) {
    return dispatch => {
        dispatch({
            type: IncidentConstants.UPDATE_INCIDENT_REQUEST
        });

        IncidentService.updateIncident(id, data)
            .then(res => {
                dispatch({
                    type: IncidentConstants.UPDATE_INCIDENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: IncidentConstants.UPDATE_INCIDENT_FAILURE,
                    error: err
                });
            })
    };
}

function deleteIncident(assetId, incidentId) {
    return async dispatch => {
        try {
            dispatch({
                type: IncidentConstants.DELETE_INCIDENT_REQUEST
            });
            const response = await IncidentService.deleteIncident(assetId, incidentId);
            dispatch({
                type: IncidentConstants.DELETE_INCIDENT_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: IncidentConstants.DELETE_INCIDENT_FAILURE,
                error: err
            });
        }

    }
}
