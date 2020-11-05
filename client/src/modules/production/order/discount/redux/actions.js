import { DiscountConstants } from './constants';
import { DiscountServices } from './services';

export const DiscountActions = {
    createNewDiscount,
    getAllDiscounts
}

function createNewDiscount (data) {
    return (dispatch) => {
        dispatch({
            type: DiscountConstants.CREATE_DISCOUNT_REQUEST
        });

        DiscountServices.createNewDiscount(data)
        .then((res) => {
            dispatch({
                type: DiscountConstants.CREATE_DISCOUNT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: DiscountConstants.CREATE_DISCOUNT_FAILURE,
                error
            })
        })
    }
}

function getAllDiscounts (queryData) {
    return (dispatch) => {
        dispatch({
            type: DiscountConstants.GET_ALL_DISCOUNTS_REQUEST
        })

        DiscountServices.getAllDiscounts(queryData)
        .then((res) => {
            dispatch({
                type: DiscountConstants.GET_ALL_DISCOUNTS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: DiscountConstants.GET_DETAIL_DISCOUNT_FAILURE,
                error
            })
        })
    }
}