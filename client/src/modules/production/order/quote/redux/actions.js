import { QuoteConstants } from './constants';
import { QuoteServices } from  './services';

export const QuoteActions = {
    createNewQuote,
    getAllQuotes,
    editQuote,
    deleteQuote,
    approveQuote,
    getQuotesToMakeOrder,
    getQuoteDetail
}

function createNewQuote (data) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.CREATE_QUOTE_REQUEST
        });
        QuoteServices.createNewQuote(data)
            .then((res) => {
                dispatch({
                    type: QuoteConstants.CREATE_QUOTE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: QuoteConstants.CREATE_QUOTE_FAILURE,
                    error
                });
            });
    }
}

function getAllQuotes (queryData) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.GET_ALL_QUOTES_REQUEST
        })
        QuoteServices.getAllQuotes(queryData)
        .then((res)=> {
            dispatch({
                type: QuoteConstants.GET_ALL_QUOTES_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: QuoteConstants.GET_ALL_QUOTES_FAILURE,
                error
            })
        })
    }
}

function editQuote (id, data) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.EDIT_QUOTE_REQUEST
        })

        QuoteServices.editQuote(id, data)
        .then((res) => {
            dispatch({
                type: QuoteConstants.EDIT_QUOTE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: QuoteConstants.EDIT_QUOTE_FAILURE,
                error
            })
        })
    }
}

function deleteQuote (id) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.DELETE_QUOTE_REQUEST
        })

        QuoteServices.deleteQuote(id)
        .then((res) => {
            dispatch({
                type: QuoteConstants.DELETE_QUOTE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: QuoteConstants.DELETE_QUOTE_FAILURE,
                error
            })
        })
    }
}

function approveQuote(id, data) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.APPROVE_QUOTE_REQUEST
        })

        QuoteServices.approveQuote(id, data)
        .then((res) => {
            dispatch({
                type: QuoteConstants.APPROVE_QUOTE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: QuoteConstants.APPROVE_QUOTE_FAILURE,
                error
            })
        })
    }
}

//Lấy các báo giá đã được duyệt để tạo đơn hàng
function getQuotesToMakeOrder(queryData) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.GET_QUOTES_TO_MAKE_ORDER_REQUEST
        })
        QuoteServices.getQuotesToMakeOrder(queryData)
            .then((res) => {
            dispatch({
                type: QuoteConstants.GET_QUOTES_TO_MAKE_ORDER_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: QuoteConstants.GET_QUOTES_TO_MAKE_ORDER_FAILURE,
                error
            })
        })
    }
}

function getQuoteDetail(id) {
    return (dispatch) => {
        dispatch({
            type: QuoteConstants.GET_QUOTE_DETAIL_REQUEST
        })

        QuoteServices.getQuoteDetail(id)
            .then((res) => {
                dispatch({
                    type: QuoteConstants.GET_QUOTE_DETAIL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch((error) => {
                dispatch({
                    type: QuoteConstants.GET_QUOTE_DETAIL_FAILURE,
                    error
                })
            })
    }
}
