import { GoodServices } from './services';
import { GoodConstants } from './constants';

export const GoodActions = {
    getGoodsByType,
    getAllGoods,
    getAllGoodsByType,
    getAllGoodsByCategory,
    createGoodByType,
    editGood,
    getGoodDetail,
    deleteGood,
    getItemsForGood
}

function getGoodsByType(data = undefined){
    if(data !== undefined && data.limit !== undefined && data.page !== undefined) {
        return dispatch => {
            dispatch({
                type: GoodConstants.PAGINATE_GOOD_BY_TYPE_REQUEST
            })
            GoodServices.getGoodsByType(data)
            .then(res => {
                dispatch({
                    type: GoodConstants.PAGINATE_GOOD_BY_TYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: GoodConstants.PAGINATE_GOOD_BY_TYPE_FAILURE,
                    error: err
                })
            })
        }
    }
    return dispatch => {
        dispatch({
            type: GoodConstants.GET_GOOD_BY_TYPE_REQUEST
        })
        GoodServices.getGoodsByType(data)
        .then(res => {
            dispatch({
                type: GoodConstants.GET_GOOD_BY_TYPE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.GET_GOOD_BY_TYPE_FAILURE,
                error: err
            })
        })
    }
}

function getAllGoods(data){
    return dispatch => {
        dispatch({
            type: GoodConstants.GETALL_GOODS_REQUEST
        })
        GoodServices.getAllGoods(data)
        .then(res => {
            dispatch({
                type: GoodConstants.GETALL_GOODS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.GETALL_GOODS_FAILURE,
                error: err
            })
        })
    }
}

function getAllGoodsByType(data){
    return dispatch => {
        dispatch({
            type: GoodConstants.GETALL_GOOD_BY_TYPE_REQUEST
        })
        GoodServices.getAllGoodsByType(data)
        .then(res => {
            dispatch({
                type: GoodConstants.GETALL_GOOD_BY_TYPE_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.GETALL_GOOD_BY_TYPE_FAILURE,
                error: err
            })
        })
    }
}

function getAllGoodsByCategory(id){
    return dispatch => {
        dispatch({
            type: GoodConstants.GETALL_GOOD_BY_CATEGORY_REQUEST
        })
        GoodServices.getAllGoodsByCategory(id)
        .then(res => {
            dispatch({
                type: GoodConstants.GETALL_GOOD_BY_CATEGORY_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.GETALL_GOOD_BY_CATEGORY_FAILURE,
                error: err
            })
        })
    }
}

function createGoodByType(data){
    return dispatch => {
        dispatch({
            type: GoodConstants.CREATE_GOOD_REQUEST
        })
        GoodServices.createGoodByType(data)
        .then(res => {
            dispatch({
                type: GoodConstants.CREATE_GOOD_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.CREATE_GOOD_FAILURE,
                error: err
            })
        })
    }
}

function getGoodDetail(id){
    return dispatch => {
        dispatch({
            type: GoodConstants.GET_GOOD_DETAIL_REQUEST
        })
        GoodServices.getGoodDetail(id)
        .then(res => {
            dispatch({
                type: GoodConstants.GET_GOOD_DETAIL_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.GET_GOOD_DETAIL_FAILURE,
                error: err
            })
        })
    }
}

function editGood(id, data){
    return dispatch => {
        dispatch({
            type: GoodConstants.UPDATE_GOOD_REQUEST
        })
        GoodServices.editGood(id, data)
        .then(res => {
            dispatch({
                type: GoodConstants.UPDATE_GOOD_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.UPDATE_GOOD_FAILURE,
                error: err
            })
        })
    }
}

function deleteGood(id){
    return dispatch => {
        dispatch({
            type: GoodConstants.DELETE_GOOD_REQUEST
        })
        GoodServices.deleteGood(id)
        .then(res => {
            dispatch({
                type: GoodConstants.DELETE_GOOD_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.UPDATE_GOOD_FAILURE,
                error: err
            })
        })
    }
}

function getTaxByGoodsId(goodId) {
    return new Promise((resolve, reject) => {
        GoodServices.getTaxByGoodsId(goodId)
            .then(res => {resolve(res.data.content)})
            .catch(err => {reject(err)})
    })
}

function getSlaByGoodsId(goodId) {
    return new Promise((resolve, reject) => {
        GoodServices.getSlaByGoodsId(goodId)
            .then(res => { resolve(res.data.content) })
            .catch(err => {reject(err)})
    })
}

function getDiscountByGoodsId(goodId) {
    return new Promise((resolve, reject) => {
        GoodServices.getDiscountByGoodsId(goodId)
            .then(res => { resolve(res.data.content) })
            .catch(err => {reject(err)})
    })
}

function getItemsForGood(goodId) {
    return dispatch => {
        dispatch({
            type: GoodConstants.GET_ITEMS_FOR_GOOD_REQUEST
        })
        Promise.all([
            getTaxByGoodsId(goodId),
            getSlaByGoodsId(goodId),
            getDiscountByGoodsId(goodId)
        ])
            .then(res => {
            dispatch({
                type: GoodConstants.GET_ITEMS_FOR_GOOD_SUCCESS,
                payload: {
                    goodId: goodId,
                    listTaxsByGoodId: res[0].taxs,
                    listSlasByGoodId: res[1].slas,
                    listDiscountsByGoodId: res[2].discounts
                }
            })
        })
        .catch(err => {
            dispatch({
                type: GoodConstants.GET_ITEMS_FOR_GOOD_FAILURE,
                error: err
            })
        })
    }
}