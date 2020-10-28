import { purchasingRequestConstants } from "./constants"
import { purchasingRequestServices } from "./services";

export const purchasingRequestActions = {
    getAllPurchasingRequests,
}

function getAllPurchasingRequests(query = {}) {
    return dispatch => {
        dispatch({
            type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_REQUEST
        });
        purchasingRequestServices.getAllPurchasingRequests(query)
            .then((res) => {
                console.log(res.data.content)
                dispatch({
                    type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: purchasingRequestConstants.GET_ALL_PURCHASING_REQUEST_FAILURE,
                    error
                });
            });

    }
}