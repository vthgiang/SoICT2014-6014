import { ExternalServiceConsumerServices } from "./services";
import { ExternalServiceConsumerConstants } from "./constants";

export const ExternalServiceConsumerActions = {
    getExternalServiceConsumers,
    createExternalServiceConsumer,
    editExternalServiceConsumer,
    deleteExternalServiceConsumer,
}

function getExternalServiceConsumers(data) {
    return dispatch => {
        dispatch({ type: ExternalServiceConsumerConstants.GET_EXTERNAL_SERVICE_CONSUMER_REQUEST });

        ExternalServiceConsumerServices.getExternalServiceConsumers(data)
            .then(res => {
                dispatch({
                    type: ExternalServiceConsumerConstants.GET_EXTERNAL_SERVICE_CONSUMER_SUCCESS,
                    payload: res.data
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ExternalServiceConsumerConstants.GET_EXTERNAL_SERVICE_CONSUMER_FAILURE,
                    payload: error
                });
                
            })
    }
}

function createExternalServiceConsumer(data) {
    return dispatch => {
        dispatch({ type: ExternalServiceConsumerConstants.CREATE_EXTERNAL_SERVICE_CONSUMER_REQUEST });

        ExternalServiceConsumerServices.createExternalServiceConsumer(data)
            .then(res => {
                dispatch({
                    type: ExternalServiceConsumerConstants.CREATE_EXTERNAL_SERVICE_CONSUMER_SUCCESS,
                    payload: res.data
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ExternalServiceConsumerConstants.CREATE_EXTERNAL_SERVICE_CONSUMER_FAILURE,
                    payload: error
                });
                
            })
    }
}

function editExternalServiceConsumer(externalServiceConsumerId, data) {
    return dispatch => {
        dispatch({ type: ExternalServiceConsumerConstants.EDIT_EXTERNAL_SERVICE_CONSUMER_REQUEST });

        ExternalServiceConsumerServices.editExternalServiceConsumer(externalServiceConsumerId, data)
            .then(res => {
                dispatch({
                    type: ExternalServiceConsumerConstants.EDIT_EXTERNAL_SERVICE_CONSUMER_SUCCESS,
                    payload: res.data
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ExternalServiceConsumerConstants.EDIT_EXTERNAL_SERVICE_CONSUMER_FAILURE,
                    payload: error
                });
                
            })
    }
}

function deleteExternalServiceConsumer(externalServiceConsumerId) {
    return dispatch => {
        dispatch({ type: ExternalServiceConsumerConstants.DELETE_EXTERNAL_SERVICE_CONSUMER_REQUEST });

        ExternalServiceConsumerServices.deleteExternalServiceConsumer(externalServiceConsumerId)
            .then(res => {
                dispatch({
                    type: ExternalServiceConsumerConstants.DELETE_EXTERNAL_SERVICE_CONSUMER_SUCCESS,
                    payload: externalServiceConsumerId
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ExternalServiceConsumerConstants.DELETE_EXTERNAL_SERVICE_CONSUMER_FAILURE,
                    payload: error
                });
                
            })
    }
}
