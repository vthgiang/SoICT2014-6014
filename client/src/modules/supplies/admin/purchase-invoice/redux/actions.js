import { PurchaseInvoiceConstants } from "./constants";
import { PurchaseInvoiceService } from "./services";

export const PurchaseInvoiceActions = {
    searchPurchaseInvoice,
    createPurchaseInvoices,
    updatePurchaseInvoice,
    deletePurchaseInvoices,
    getPurchaseInvoiceById
}

function searchPurchaseInvoice(data) {
    return (dispatch) => {
        dispatch({
            type: PurchaseInvoiceConstants.SEARCH_PURCHASE_INVOICE_REQUEST
        });
        PurchaseInvoiceService.searchPurchaseInvoice(data)
            .then((res) => {
                dispatch({
                    type: PurchaseInvoiceConstants.SEARCH_PURCHASE_INVOICE_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: PurchaseInvoiceConstants.SEARCH_PURCHASE_INVOICE_FAILURE,
                    error: err,
                });
            });
    };
}

function createPurchaseInvoices(data) {
    return (dispatch) => {
        // tao moi
        dispatch({
            type: PurchaseInvoiceConstants.CREATE_PURCHASE_INVOICES_REQUEST,
        });
        // 
        PurchaseInvoiceService.createPurchaseInvoices(data)
            .then((res) => {
                if (res.data) {
                    dispatch({
                        type: PurchaseInvoiceConstants.CREATE_PURCHASE_INVOICES_SUCCESS,
                        payload: res.data.content
                    });
                }

            }).catch((err) => {
                dispatch({
                    type: PurchaseInvoiceConstants.CREATE_PURCHASE_INVOICES_FAILURE,
                    error: err,
                    payload: err.response.data.content
                });
            });
    }
}

function updatePurchaseInvoice(id, data) {
    return (dispatch) => {
        dispatch({
            type: PurchaseInvoiceConstants.UPDATE_PURCHASE_INVOICE_REQUEST,
        });
        PurchaseInvoiceService.updatePurchaseInvoice(id, data)
            .then((res) => {
                dispatch({
                    type: PurchaseInvoiceConstants.UPDATE_PURCHASE_INVOICE_SUCCESS,
                    payload: res.data.content
                });
            }).catch((err) => {
                dispatch({
                    type: PurchaseInvoiceConstants.UPDATE_PURCHASE_INVOICE_FAILURE,
                    error: err,
                });
            });
    }
}

function deletePurchaseInvoices(data) {
    return (dispatch) => {
        dispatch({
            type: PurchaseInvoiceConstants.DELETE_PURCHASE_INVOICES_REQUEST,
        });
        PurchaseInvoiceService.deletePurchaseInvoices(data)
            .then((res) => {
                dispatch({
                    type: PurchaseInvoiceConstants.DELETE_PURCHASE_INVOICES_SUCCESS,
                    payload: res.data.content,
                    ids: data.ids
                });
            }).catch((err) => {
                dispatch({
                    type: PurchaseInvoiceConstants.DELETE_PURCHASE_INVOICES_FAILURE,
                    error: err,
                });
            });
    }
}

function getPurchaseInvoiceById(id) {
    return (dispatch) => {
        dispatch({
            type: PurchaseInvoiceConstants.GET_PURCHASE_INVOICE_BY_ID_REQUEST,
        });
        PurchaseInvoiceService.getPurchaseInvoiceById(id)
            .then((res) => {
                dispatch({
                    type: PurchaseInvoiceConstants.GET_PURCHASE_INVOICE_BY_ID_SUCCESS,
                    payload: res.data.content,
                });
            }).catch((err) => {
                dispatch({
                    type: PurchaseInvoiceConstants.GET_PURCHASE_INVOICE_BY_ID_FAILURE,
                    error: err,
                });
            });
    }
}