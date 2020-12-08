import { salesOrderConstants } from "./constants"
import { salesOrderSevices } from "./services";

export const salesOrderActions = {
    getAllSalesOrder,
}

function getAllSalesOrder() {
    return dispatch => {
        dispatch({
            type: salesOrderConstants.GET_ALL_SALES_ORDERS_REQUEST
        });
        salesOrderSevices.getAllSalesOrder()
            .then((res) => {
                dispatch({
                    type: salesOrderConstants.GET_ALL_SALES_ORDERS_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: salesOrderConstants.GET_ALL_SALES_ORDERS_FAILURE,
                    error
                });
            });
    }
}
