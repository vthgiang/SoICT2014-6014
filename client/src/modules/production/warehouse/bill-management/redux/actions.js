import { BillServices } from './services';
import { BillConstants } from './constants';

export const BillActions = {
    getBillsByType,
    getBillByGood,
    getDetailBill
}

function getBillsByType(data) {
    if(data !== undefined && data.limit !== undefined && data.page !== undefined) {
        return dispatch => {
            dispatch({
                type: BillConstants.GET_PAGINATE_REQUEST
            })
            BillServices.getBillsByType(data)
            .then(res => {
                dispatch({
                    type: BillConstants.GET_PAGINATE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BillConstants.GET_PAGINATE_FAILURE,
                    error: err
                })
            })
        }
    }
    return dispatch => {
        dispatch({
            type: BillConstants.GET_BILL_BY_TYPE_REQUEST
        })
        BillServices.getBillsByType(data)
        .then(res => {
            dispatch({
                type: BillConstants.GET_BILL_BY_TYPE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: BillConstants.GET_BILL_BY_TYPE_FAILURE,
                error: err
            })
        })
    }
}

function getBillByGood(data) {
    return dispatch => {
        dispatch({
            type: BillConstants.GET_BILL_BY_GOOD_REQUEST
        })
        BillServices.getBillByGood(data)
        .then(res => {
            dispatch({
                type: BillConstants.GET_BILL_BY_GOOD_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: BillConstants.GET_BILL_BY_GOOD_FAILURE,
                error: err
            })
        })
    }
}

function getDetailBill(id) {
    return dispatch => {
        dispatch({
            type: BillConstants.GET_BILL_DETAIL_REQUEST
        })
        BillServices.getDetailBill(id)
        .then(res => {
            dispatch({
                type: BillConstants.GET_BILL_DETAIL_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: BillConstants.GET_BILL_DETAIL_FAILURE,
                error: err
            })
        })
    }
}