const { LotServices } = require('./services');
const { LotConstants } = require('./constants');

export const LotActions = {
    getAllLots
}

function getAllLots(data = undefined){
    if(data !== undefined) {
        return dispatch => {
            dispatch({
                type: LotConstants.GET_PAGINATE_LOT_REQUEST
            })
            LotServices.getAllLots(data)
            .then(res => {
                dispatch({
                    type: LotConstants.GET_PAGINATE_LOT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: LotConstants.GET_PAGINATE_LOT_FAILURE,
                    error: err
                })
            })
        }
    }
    return dispatch => {
        dispatch({
            type: LotConstants.GET_LOT_REQUEST
        })
        LotServices.getAllLots()
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