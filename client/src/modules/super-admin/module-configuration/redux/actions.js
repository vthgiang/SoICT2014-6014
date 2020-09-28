import {
    ConfigurationServices
} from "./services";

import {
    ConfigurationConstants
} from "./constants";

export const ConfigurationActions = {
    getConfiguration,
};

/**
 * Lấy danh sách tất cả các link của 1 công ty
 */
function getConfiguration() {
    return dispatch => {
        dispatch({
            type: ConfigurationConstants.GET_CONFIGURATION_REQUEST
        });
        ConfigurationServices.getConfiguration()
            .then(res => {
                dispatch({
                    type: ConfigurationConstants.GET_CONFIGURATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: ConfigurationConstants.GET_CONFIGURATION_FAILE,
                    error: err
                });
            })
    }
}