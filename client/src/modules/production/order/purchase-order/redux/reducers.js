import { PurchaseOrderConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}
const initState = {
    isLoading: false,
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    listPurchaseOrders: [],
}

export function purchaseOrders(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case PurchaseOrderConstants.CREATE_PURCHASE_ORDER_REQUEST:
        case PurchaseOrderConstants.UPDATE_PURCHASE_ORDER_REQUEST:
        case PurchaseOrderConstants.GET_ALL_PURCHASE_ORDERS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case PurchaseOrderConstants.CREATE_PURCHASE_ORDER_FAILURE:
        case PurchaseOrderConstants.UPDATE_PURCHASE_ORDER_FAILURE:
        case PurchaseOrderConstants.GET_ALL_PURCHASE_ORDERS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case PurchaseOrderConstants.GET_ALL_PURCHASE_ORDERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPurchaseOrders: action.payload.allPurchaseOrders.docs,
                totalDocs: action.payload.allPurchaseOrders.totalDocs,
                limit: action.payload.allPurchaseOrders.limit,
                totalPages: action.payload.allPurchaseOrders.totalPages,
                page: action.payload.allPurchaseOrders.page,
                pagingCounter: action.payload.allPurchaseOrders.pagingCounter,
                hasPrevPage: action.payload.allPurchaseOrders.hasPrevPage,
                hasNextPage: action.payload.allPurchaseOrders.hasNextPage,
                prevPage: action.payload.allPurchaseOrders.prevPage,
                nextPage: action.payload.allPurchaseOrders.nextPage
            }
        case PurchaseOrderConstants.CREATE_PURCHASE_ORDER_SUCCESS:
            return {
                ...state,
                listPurchaseOrders: [
                    ...state.listPurchaseOrders,
                    action.payload.purchaseOrder
                ],
                isLoading: false
            }
        case PurchaseOrderConstants.UPDATE_PURCHASE_ORDER_SUCCESS:
            index = findIndex(state.listPurchaseOrders, action.payload.purchaseOrder._id);
            if (index !== -1) {
                state.listPurchaseOrders[index] = action.payload.purchaseOrder
            }
            return {
                ...state,
                isLoading: false
            }
        default:
            return state
    }
}