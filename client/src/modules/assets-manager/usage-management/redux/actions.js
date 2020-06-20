import {UsageService} from './services';
import {UsageConstants} from './constants';

export const UsageActions = {
    createUsage,
    updateUsage,
    deleteUsage
}

function createUsage(id, data) {
    return async dispatch => {
        try {
            dispatch({
                type: UsageConstants.CREATE_USAGE_REQUEST
            });
            const response = await UsageService.createUsage(id, data);
            dispatch({
                type: UsageConstants.CREATE_USAGE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: UsageConstants.CREATE_USAGE_FAILURE,
                error: err
            });
        }

    };
}

function updateUsage(id, data) {
    return dispatch => {
        dispatch({
            type: UsageConstants.UPDATE_USAGE_REQUEST
        });

        UsageService.updateUsage(id, data)
            .then(res => {
                dispatch({
                    type: UsageConstants.UPDATE_USAGE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: UsageConstants.UPDATE_USAGE_FAILURE,
                    error: err
                });
            })
    };
}

function deleteUsage(assetId, usageId) {
    return async dispatch => {
        try {
            dispatch({
                type: UsageConstants.DELETE_USAGE_REQUEST
            });
            const response = await UsageService.deleteUsage(assetId, usageId);
            dispatch({
                type: UsageConstants.DELETE_USAGE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: UsageConstants.DELETE_USAGE_FAILURE,
                error: err
            });
        }

    }
}
