import { StockServices } from './services';
import { StockConstants } from './constants';

export const StockActions = {
    getAllStocks,
    getStock,
    createStock,
    editStock,
    deleteStock,
    importStock,
}

function getAllStocks(data){
    if(data !== undefined && data.limit !== undefined && data.page !== undefined){
        return dispatch => {
            dispatch({
                type: StockConstants.PAGINATE_STOCK_REQUEST
            })
            StockServices.getAllStocks(data)
            .then(res => {
                dispatch({
                    type: StockConstants.PAGINATE_STOCK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: StockConstants.PAGINATE_STOCK_FAILURE,
                    error: err
                })
            })
        }
    }
    else {
        return dispatch => {
            dispatch({
                type: StockConstants.GET_STOCK_REQUEST
            })
            StockServices.getAllStocks(data)
            .then(res => {
                dispatch({
                    type: StockConstants.GET_STOCK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: StockConstants.GET_STOCK_FAILURE,
                    error: err
                })
            })
        }
    }
}

function getStock(id){
    return dispatch => {
        dispatch({
            type: StockConstants.GET_DETAIL_STOCK_REQUEST
        })
        StockServices.getStock(id)
        .then(res => {
            dispatch({
                type: StockConstants.GET_DETAIL_STOCK_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: StockConstants.GET_DETAIL_STOCK_FAILURE,
                error: err
            })
        })
    }
}

function createStock(data){
    return dispatch => {
        dispatch({
            type: StockConstants.CREATE_STOCK_REQUEST
        })
        StockServices.createStock(data)
        .then(res => {
            dispatch({
                type: StockConstants.CREATE_STOCK_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: StockConstants.CREATE_STOCK_FAILURE,
                error: err
            })
        })
    }
}

function editStock(id, data){
    return dispatch => {
        dispatch({
            type: StockConstants.UPDATE_STOCK_REQUEST
        })
        StockServices.editStock(id, data)
        .then(res => {
            dispatch({
                type: StockConstants.UPDATE_STOCK_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: StockConstants.UPDATE_STOCK_FAILURE,
                error: err
            })
        })
    }
}

function deleteStock(id){
    return dispatch => {
        dispatch({
            type: StockConstants.DELETE_STOCK_REQUEST
        })
        StockServices.deleteStock(id)
        .then(res => {
            dispatch({
                type: StockConstants.DELETE_STOCK_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: StockConstants.DELETE_STOCK_FAILURE,
                error: err
            })
        })
    }
}

function importStock(data) {
    return dispatch => {
        dispatch({
            type: StockConstants.IMPORT_STOCK_REQUEST,
        });
        StockServices.importStock(data)
            .then(res => {
                dispatch({
                    type: StockConstants.IMPORT_STOCK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: StockConstants.IMPORT_STOCK_FAILURE,
                });
            })
    }
}
