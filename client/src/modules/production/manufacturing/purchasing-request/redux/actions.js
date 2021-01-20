import { purchasingRequestConstants } from "./constants"
import { purchasingRequestServices } from "./services";

export const purchasingRequestActions = {
    getAllPurchasingRequests,
    createPurchasingRequest,
    getDetailPurchasingRequest,
    editPurchasingRequest,
    getNumberPurchasingStatus
}

function getAllPurchasingRequests(query = {}) {
    return dispatch => {
        dispatch({
            type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_REQUEST
        });
        purchasingRequestServices.getAllPurchasingRequests(query)
            .then((res) => {
                dispatch({
                    type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_FAILURE,
                    error
                });
            });

    }
}

function createPurchasingRequest(data) {
    console.log(data);
    return dispatch => {
        dispatch({
            type: purchasingRequestConstants.CREATE_PURCHASING_REQUEST_REQUEST
        });
        purchasingRequestServices.createPurchasingRequest(data)
            .then((res) => {
                dispatch({
                    type: purchasingRequestConstants.CREATE_PURCHASING_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: purchasingRequestConstants.CREATE_PURCHASING_REQUEST_FAILURE,
                    error
                });
            });
    }
}

function getDetailPurchasingRequest(id) {
    return dispatch => {
        dispatch({
            type: purchasingRequestConstants.GET_DETAIL_PURCHASING_REQUEST_REQUEST
        });
        purchasingRequestServices.getDetailPurchasingRequest(id)
            .then((res) => {
                dispatch({
                    type: purchasingRequestConstants.GET_DETAIL_PURCHASING_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: purchasingRequestConstants.GET_DETAIL_PURCHASING_REQUEST_FAILURE,
                    error
                });
            })
    }
}

function editPurchasingRequest(id, data) {
    return dispatch => {
        dispatch({
            type: purchasingRequestConstants.UPDATE_PURCHASING_REQUEST_REQUEST
        });
        purchasingRequestServices.editPurchasingRequest(id, data)
            .then((res) => {
                dispatch({
                    type: purchasingRequestConstants.UPDATE_PURCHASING_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: purchasingRequestConstants.UPDATE_PURCHASING_REQUEST_FAILURE,
                    error
                });
            });
    }
}

function getNumberPurchasingStatus(query) {
    return dispatch => {
        dispatch({
            type: purchasingRequestConstants.GET_NUMBER_PURCHASING_REQUEST_REQUEST
        });
        purchasingRequestServices.getNumberPurchasingStatus(query)
            .then((res) => {
                dispatch({
                    type: purchasingRequestConstants.GET_NUMBER_PURCHASING_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: purchasingRequestConstants.GET_NUMBER_PURCHASING_REQUEST_FAILURE,
                    error
                });
            });
    }
}