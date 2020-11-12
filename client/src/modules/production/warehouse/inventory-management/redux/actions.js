const { LotServices } = require('./services');
const { LotConstants } = require('./constants');

export const LotActions = {
    getAllLots,
    getDetailLot,
    editLot,
    getLotsByGood,
    createOrUpdateLots
}

function getAllLots(data){
    if(data !== undefined && data.limit !== undefined && data.page !== undefined) {
        return dispatch => {
            dispatch({
                type: LotConstants.GET_LOT_PAGINATE_REQUEST
            })
            LotServices.getAllLots(data)
            .then(res => {
                dispatch({
                    type: LotConstants.GET_LOT_PAGINATE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: LotConstants.GET_LOT_PAGINATE_FAILURE,
                    error: error
                })
            })
        }
    }
    return dispatch => {
        dispatch({
            type: LotConstants.GET_LOT_REQUEST
        })
        LotServices.getAllLots(data)
        .then(res => {
            dispatch({
                type: LotConstants.GET_LOT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: LotConstants.GET_LOT_FAILURE,
                error: err
            })
        })
    }
}

function getDetailLot(id) {
    return dispatch => {
        dispatch({
            type: LotConstants.GET_LOT_DETAIL_REQUEST
        })
        LotServices.getDetailLot(id)
        .then(res => {
            dispatch({
                type: LotConstants.GET_LOT_DETAIL_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: LotConstants.GET_LOT_DETAIL_FAILURE,
                error: err
            })
        })
    }
}

function editLot(id, data) {
    return dispatch => {
        dispatch({
            type: LotConstants.EDIT_LOT_REQUEST
        })
        LotServices.editLot(id, data)
        .then(res => {
            dispatch({
                type: LotConstants.EDIT_LOT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: LotConstants.EDIT_LOT_FAILURE,
                error: err
            })
        })
    }
}

function getLotsByGood(data) {
    return dispatch => {
        dispatch({
            type: LotConstants.GET_LOT_BY_GOOD_REQUEST
        })
        LotServices.getLotsByGood(data)
        .then(res => {
            dispatch({
                type: LotConstants.GET_LOT_BY_GOOD_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({
                type: LotConstants.GET_LOT_BY_GOOD_FAILURE,
                error: err
            })
        })
    }
}

function createOrUpdateLots(data) {
    return dispatch => {
        dispatch({
            type: LotConstants.CREATE_OR_EDIT_LOT_REQUEST
        })
        LotServices.createOrUpdateLots(data)
        .then(res => {
            dispatch({
                type: LotConstants.CREATE_OR_EDIT_LOT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch( err => {
            dispatch({
                type: LotConstants.CREATE_OR_EDIT_LOT_FAILURE,
                error:err
            })
        })
    }
}