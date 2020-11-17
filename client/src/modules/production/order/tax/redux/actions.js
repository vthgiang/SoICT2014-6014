import { TaxConstants } from './constants';
import { TaxServices } from './services';

export const TaxActions = {
    createNewTax,
    getAllTaxs,
    getTaxById,
    updateTax,
    disableTax,
    checkTaxCode,
    getTaxByCode,
    deleteTax, 
    getTaxsByGoodsId
}

function createNewTax (data) {
    return (dispatch) => {
        dispatch({
            type: TaxConstants.CREATE_TAX_REQUEST
        });

        TaxServices.createNewTax(data)
        .then((res) => {
            dispatch({
                type: TaxConstants.CREATE_TAX_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.CREATE_TAX_FAILURE,
                error
            })
        })
    }
}

function getAllTaxs (queryData) {
    return (dispatch) => {
        dispatch({
            type: TaxConstants.GET_ALL_TAXS_REQUEST
        })

        TaxServices.getAllTaxs(queryData)
        .then((res) => {
            dispatch({
                type: TaxConstants.GET_ALL_TAXS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.GET_ALL_TAXS_FAILURE,
                error
            })
        })
    }
}

function getTaxById(id){
    return (dispatch) => {
        dispatch({
            type: TaxConstants.GET_DETAIL_TAX_REQUEST
        })

        TaxServices.getTaxById(id)
        .then((res) => {
            dispatch({
                type: TaxConstants.GET_DETAIL_TAX_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.GET_DETAIL_TAX_FAILURE,
                error
            })
        })
    }
}

function updateTax (id, data) {
    return (dispatch) => {
        dispatch({
            type: TaxConstants.UPDATE_TAX_REQUEST
        })

        TaxServices.updateTax(id, data)
        .then((res) => {
            dispatch({
                type: TaxConstants.UPDATE_TAX_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.UPDATE_TAX_FAILURE,
                error
            })
        })
    }
}

function disableTax (id) {
    return (dispatch) => {
        dispatch({
            type: TaxConstants.DISABLE_TAX_REQUEST
        })

        TaxServices.disableTax(id)
        .then((res) => {
            dispatch({
                type: TaxConstants.DISABLE_TAX_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.DISABLE_TAX_FAILURE,
                error
            })
        })
    }
}

function checkTaxCode (code) {
    return (dispatch) => {
        dispatch({
            type: TaxConstants.CHECK_TAX_CODE_REQUEST
        })

        TaxServices.checkTaxCode(code)
        .then((res) => {
            dispatch({
                type: TaxConstants.CHECK_TAX_CODE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.CHECK_TAX_CODE_FAILURE,
                error
            })
        })
    }
}

function getTaxByCode (code) {
    return (dispatch) => {
        dispatch({
            type: TaxConstants.GET_TAX_BY_CODE_REQUEST
        })

        TaxServices.getTaxByCode(code)
        .then((res) => {
            dispatch({
                type: TaxConstants.GET_TAX_BY_CODE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.GET_TAX_BY_CODE_FAILURE,
                error
            })
        })
    }
}

function deleteTax (code) {
    return (dispatch) => {
        dispatch({
            type: TaxConstants.DELETE_TAX_BY_CODE_REQUEST
        })

        TaxServices.deleteTax(code)
        .then((res) => {
            dispatch({
                type: TaxConstants.DELETE_TAX_BY_CODE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.DELETE_TAX_BY_CODE_FAILURE,
                error
            })
        })
    }
}

function getTaxsByGoodsId (goodId) {
    return (dispatch) => {
        dispatch({
            type: TaxConstants.GET_TAX_BY_GOOD_ID_REQUEST
        })

        TaxServices.getTaxsByGoodsId(goodId)
        .then((res) => {
            dispatch({
                type: TaxConstants.GET_TAX_BY_GOOD_ID_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: TaxConstants.GET_TAX_BY_GOOD_ID_FAILURE,
                error
            })
        })
    }
}