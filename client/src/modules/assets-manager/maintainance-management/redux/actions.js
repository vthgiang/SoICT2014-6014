import {MaintainanceService} from './services';
import {MaintainanceConstants} from './constants';

export const MaintainanceActions = {
    createMaintainance,
    // updateMaintainance, 
    deleteMaintainance
}

function createMaintainance(id, data) {
    return async dispatch => {
        try {
            dispatch({
                type: MaintainanceConstants.CREATE_MAINTAINANCE_REQUEST
            });
            const response = await MaintainanceService.createMaintainance(id, data);
            dispatch({
                type: MaintainanceConstants.CREATE_MAINTAINANCE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: MaintainanceConstants.CREATE_MAINTAINANCE_FAILURE,
                error: err
            });
        }

    };
}

function deleteMaintainance(assetId, maintainanceId) {
    return async dispatch => {
        try {
            dispatch({
                type: MaintainanceConstants.DELETE_MAINTAINANCE_REQUEST
            });
            const response = await MaintainanceService.deleteMaintainance(assetId, maintainanceId);
            dispatch({
                type: MaintainanceConstants.DELETE_MAINTAINANCE_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: MaintainanceConstants.DELETE_MAINTAINANCE_FAILURE,
                error: err
            });
        }

    }
}