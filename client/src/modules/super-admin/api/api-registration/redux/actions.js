import { ApiRegistrationServices } from "./services";
import { ApiRegistrationConstants } from "./constants";

export const ApiRegistrationActions = {
    registerToUseApi,
    getApiRegistration
}

function registerToUseApi(data) {
    return dispatch => {
        dispatch({ type: ApiRegistrationConstants.REGISTER_TO_USE_API_REQUEST });

        ApiRegistrationServices.registerToUseApi(data)
            .then(res => {
                dispatch({
                    type: ApiRegistrationConstants.REGISTER_TO_USE_API_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ApiRegistrationConstants.REGISTER_TO_USE_API_FAILURE,
                    payload: error
                });
                
            })
    }
}

function getApiRegistration(data) {
    return dispatch => {
        dispatch({ type: ApiRegistrationConstants.GET_API_REGISTRATION_REQUEST });

        ApiRegistrationServices.getApiRegistration(data)
            .then(res => {
                dispatch({
                    type: ApiRegistrationConstants.GET_API_REGISTRATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ApiRegistrationConstants.GET_API_REGISTRATION_FAILURE,
                    payload: error
                });
                
            })
    }
}