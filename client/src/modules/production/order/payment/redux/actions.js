import { PaymentConstants } from './constants';
import { PaymentServices } from './services';

export const BankAccountActions = {
    createPayment,
    getAllPayments,
    getPaymentDetail,
    getPaymentForOrder
}

function createPayment (data) {
    return (dispatch) => {
        dispatch({
            type: PaymentConstants.CREATE_PAYMENT_REQUEST
        });

        PaymentServices.createPayment(data)
        .then((res) => {
            dispatch({
                type: PaymentConstants.CREATE_PAYMENT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: PaymentConstants.CREATE_PAYMENT_FAILURE,
                error
            })
        })
    }
}

function getAllPayments (queryData) {
    return (dispatch) => {
        dispatch({
            type: PaymentConstants.GET_ALL_PAYMENTS_REQUEST
        })

        PaymentServices.getAllPayments(queryData)
        .then((res) => {
            dispatch({
                type: PaymentConstants.GET_ALL_PAYMENTS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: PaymentConstants.GET_ALL_PAYMENTS_FAILURE
            })
        })
    }
}

function getPaymentDetail (id) {
    return (dispatch) => {
        dispatch({
            type: PaymentConstants.GET_PAYMENT_DETAIL_REQUEST
        })

        PaymentServices.getPaymentDetail(id)
        .then((res) => {
            dispatch({
                type: PaymentConstants.GET_PAYMENT_DETAIL_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: PaymentConstants.GET_PAYMENT_DETAIL_FAILURE
            })
        })
    }
}

function getPaymentForOrder (queryData) {
    return (dispatch) => {
        dispatch({
            type: PaymentConstants.GET_PAYMENT_FOR_ORDER_REQUEST
        })

        PaymentServices.getPaymentForOrder(queryData)
        .then((res) => {
            dispatch({
                type: PaymentConstants.GET_PAYMENT_FOR_ORDER_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: PaymentConstants.GET_PAYMENT_FOR_ORDER_FAILURE
            })
        })
    }
}
