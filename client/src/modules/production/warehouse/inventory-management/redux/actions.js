import { BillConstants } from '../../bill-management/redux/constants';

const { LotServices } = require('./services');
const { LotConstants } = require('./constants');

export const LotActions = {
    getAllLots,
    getDetailLot,
    editLot,
    getLotsByGood,
    createOrUpdateLots,
    deleteManyLots,
    getAllManufacturingLots,
    createManufacturingLot,
    getDetailManufacturingLot,
    handleEditManufacturingLot

}

function getAllLots(data) {
    if (data !== undefined && data.limit !== undefined && data.page !== undefined) {
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
            .catch(err => {
                dispatch({
                    type: LotConstants.CREATE_OR_EDIT_LOT_FAILURE,
                    error: err
                })
            })
    }
}

function deleteManyLots(data) {
    return dispatch => {
        dispatch({
            type: LotConstants.DELETE_LOT_REQUEST
        })
        LotServices.deleteManyLots(data)
            .then(res => {
                dispatch({
                    type: LotConstants.DELETE_LOT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: LotConstants.DELETE_LOT_FAILURE,
                    error: err
                })
            })
    }
}

function getAllManufacturingLots(query) {
    return dispatch => {
        dispatch({
            type: LotConstants.GET_ALL_MANUFACTURING_LOT_REQUEST
        });
        LotServices.getAllManufacturingLots(query)
            .then((res) => {
                dispatch({
                    type: LotConstants.GET_ALL_MANUFACTURING_LOT_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: LotConstants.GET_ALL_MANUFACTURING_LOT_FAILURE,
                    error
                });
            });
    }
}

function createManufacturingLot(data) {
    return dispatch => {
        dispatch({
            type: LotConstants.CREATE_MANUFACTURING_LOT_REQUEST
        });
        LotServices.createManufacturingLot(data)
            .then((res) => {
                dispatch({
                    type: LotConstants.CREATE_MANUFACTURING_LOT_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: LotConstants.CREATE_MANUFACTURING_LOT_FAILURE,
                    error
                });
            });
    }
}

function getDetailManufacturingLot(id) {
    return dispatch => {
        dispatch({
            type: LotConstants.GET_DETAIL_MANUFACTURING_LOT_REQUEST
        });
        LotServices.getDetailManufacturingLot(id)
            .then((res) => {
                dispatch({
                    type: LotConstants.GET_DETAIL_MANUFACTURING_LOT_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: LotConstants.GET_DETAIL_MANUFACTURING_LOT_FAILURE,
                    error
                });
            });
    }
}

function handleEditManufacturingLot(id, data) {
    return dispatch => {
        dispatch({
            type: LotConstants.EDIT_MANUFACTURING_LOT_REQUEST
        });
        LotServices.handleEditManufacturingLot(id, data)
            .then((res) => {
                dispatch({
                    type: LotConstants.EDIT_MANUFACTURING_LOT_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: LotConstants.EDIT_MANUFACTURING_LOT_FAILURE,
                    error
                });
            });
    }
}