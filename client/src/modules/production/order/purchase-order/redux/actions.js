import { PurchaseOrderConstants } from './constants';
import { PurchaseOrderServices } from './services';

export const PurchaseOrderActions = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    updatePurchaseOrder,
}

function createPurchaseOrder (data) {
    return (dispatch) => {
        dispatch({
            type: PurchaseOrderConstants.CREATE_PURCHASE_ORDER_REQUEST
        });

        PurchaseOrderServices.createPurchaseOrder(data)
        .then((res) => {
            dispatch({
                type: PurchaseOrderConstants.CREATE_PURCHASE_ORDER_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: PurchaseOrderConstants.CREATE_PURCHASE_ORDER_FAILURE,
                error
            })
        })
    }
}

function getAllPurchaseOrders (queryData) {
    return (dispatch) => {
        dispatch({
            type: PurchaseOrderConstants.GET_ALL_PURCHASE_ORDERS_REQUEST
        })

        PurchaseOrderServices.getAllPurchaseOrders(queryData)
        .then((res) => {
            dispatch({
                type: PurchaseOrderConstants.GET_ALL_PURCHASE_ORDERS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: PurchaseOrderConstants.GET_ALL_PURCHASE_ORDERS_FAILURE
            })
        })
    }
}

function updatePurchaseOrder (id, data) {
    return (dispatch) => {
        dispatch({
            type: PurchaseOrderConstants.UPDATE_PURCHASE_ORDER_REQUEST
        })

        PurchaseOrderServices.updatePurchaseOrder(id, data)
        .then((res) => {
            dispatch({
                type: PurchaseOrderConstants.UPDATE_PURCHASE_ORDER_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: PurchaseOrderConstants.UPDATE_PURCHASE_ORDER_FAILURE,
                error
            })
        })
    }
}