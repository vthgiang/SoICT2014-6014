import { GoodServices } from './services';
import { GoodConstants } from './constants';

export const GoodActions = {
    getGoodsByType,
}

function getGoodsByType(data = undefined){
    if(data !== undefined) {
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
            type: GoodConstants.GETALL_GOOD_BY_TYPE_REQUEST
        })
        GoodServices.getGoodsByType()
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