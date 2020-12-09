import { salesOrderConstants } from "./constants";

const initState = {
    listSalesOrders: [],
    isLoading: false
}

export function salesOrder(state = initState, action) {
    switch (action.type) {
        case salesOrderConstants.GET_ALL_SALES_ORDERS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case salesOrderConstants.GET_ALL_SALES_ORDERS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case salesOrderConstants.GET_ALL_SALES_ORDERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listSalesOrders: action.payload.salesOrders
            }
        default:
            return state
    }
}