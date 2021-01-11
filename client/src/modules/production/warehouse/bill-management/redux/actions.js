import { BillServices } from './services';
import { BillConstants } from './constants';

export const BillActions = {
    getBillsByType,
    getBillByGood,
    getDetailBill,
    createBill,
    editBill,
    getBillsByStatus,
    getBillsByCommand,
    createManyProductBills,
    getNumberBills
}

function getBillsByType(data) {
    if (data !== undefined && data.limit !== undefined && data.page !== undefined) {
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

function createBill(data) {
    return dispatch => {
        dispatch({
            type: BillConstants.CREATE_BILL_REQUEST
        })
        BillServices.createBill(data)
            .then(res => {
                dispatch({
                    type: BillConstants.CREATE_BILL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BillConstants.CREATE_BILL_FAILURE,
                    error: err
                })
            })
    }
}

function editBill(id, data) {
    return dispatch => {
        dispatch({
            type: BillConstants.UPDATE_BILL_REQUEST
        })
        BillServices.editBill(id, data)
            .then(res => {
                dispatch({
                    type: BillConstants.UPDATE_BILL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BillConstants.UPDATE_BILL_FAILURE,
                    error: err
                })
            })
    }
}

function getBillsByStatus(data) {
    return dispatch => {
        dispatch({
            type: BillConstants.GET_BILL_BY_STATUS_REQUEST
        })
        BillServices.getBillsByStatus(data)
            .then(res => {
                dispatch({
                    type: BillConstants.GET_BILL_BY_STATUS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BillConstants.GET_BILL_BY_STATUS_FAILURE,
                    error: err
                })
            })
    }
}

function getBillsByCommand(data) {
    return dispatch => {
        dispatch({
            type: BillConstants.GET_BILL_BY_COMMAND_REQUEST
        })
        BillServices.getBillsByCommand(data)
            .then(res => {
                dispatch({
                    type: BillConstants.GET_BILL_BY_COMMAND_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: BillConstants.GET_BILL_BY_COMMAND_FAILURE,
                    error: err
                })
            })
    }
}

function createManyProductBills(data) {
    return dispatch => {
        dispatch({
            type: BillConstants.CREATE_MANY_PRODUCT_BILL_REQUEST
        });
        BillServices.createManyProductBills(data)
            .then((res) => {
                dispatch({
                    type: BillConstants.CREATE_MANY_PRODUCT_BILL_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: BillConstants.CREATE_MANY_PRODUCT_BILL_FAILURE,
                    error
                });
            });
    }
}

function getNumberBills(data) {
    return dispatch => {
        dispatch({
            type: BillConstants.GET_NUMBER_BILL_REQUEST,
        })
        BillServices.getNumberBills(data)
        .then(res => {
            dispatch({
                type: BillConstants.GET_NUMBER_BILL_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(error => {
            dispatch({
                type: BillConstants.GET_NUMBER_BILL_FAILURE,
                error
            })
        })
    }
}