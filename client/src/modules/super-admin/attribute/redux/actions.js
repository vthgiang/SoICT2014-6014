import { attributeConstants } from './constants';
import { attributeServices } from './services';

export const attributeActions = {
    getAttributes,
    deleteAttributes,
    createAttribute,
    editAttribute
}

function getAttributes(queryData) {
    return (dispatch) => {
        dispatch({
            type: attributeConstants.GET_ALL_ATTRIBUTES_REQUEST
        });

        attributeServices
            .getAttributes(queryData)
            .then((res) => {
                dispatch({
                    type: attributeConstants.GET_ALL_ATTRIBUTES_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: attributeConstants.GET_ALL_ATTRIBUTES_FAILURE,
                    error
                });
            });
    }
}

function deleteAttributes(data) {
    return (dispatch) => {
        dispatch({
            type: attributeConstants.DELETE_ATTRIBUTE_REQUEST
        });

        attributeServices
            .deleteAttributes(data)
            .then((res) => {
                dispatch({
                    type: attributeConstants.DELETE_ATTRIBUTE_SUCCESS,
                    payload: res.data.content,
                    attributeIds: data.attributeIds
                });
            })
            .catch((error) => {
                dispatch({
                    type: attributeConstants.DELETE_ATTRIBUTE_FAILURE,
                    error
                });
            });
    }
}

function createAttribute(data) {
    return (dispatch) => {
        dispatch({
            type: attributeConstants.CREATE_ATTRIBUTE_REQUEST
        });
        attributeServices
            .createAttribute(data)
            .then((res) => {
                dispatch({
                    type: attributeConstants.CREATE_ATTRIBUTE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: attributeConstants.CREATE_ATTRIBUTE_FAILURE,
                    error
                });
            });
    }
}

function editAttribute(id, data) {
    return (dispatch) => {
        dispatch({
            type: attributeConstants.EDIT_ATTRIBUTE_REQUEST
        });
        attributeServices
            .editAttribute(id, data)
            .then((res) => {
                dispatch({
                    type: attributeConstants.EDIT_ATTRIBUTE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: attributeConstants.EDIT_ATTRIBUTE_FAILURE,
                    error
                });
            });
    }
}