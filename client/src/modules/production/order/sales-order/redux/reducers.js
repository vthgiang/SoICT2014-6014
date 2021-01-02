import { SalesOrderConstants } from "./constants";

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
    listSalesOrders: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
}


export function salesOrders(state = initState, action) {
    let index = -1;
    switch (action.type) {
        case SalesOrderConstants.GET_ALL_SALES_ORDERS_REQUEST:
        case SalesOrderConstants.CREATE_SALES_ORDER_REQUEST:
        case SalesOrderConstants.EDIT_SALES_ORDER_REQUEST:
        case SalesOrderConstants.APPROVE_SALES_ORDER_REQUEST:
        case SalesOrderConstants.ADD_MANUFACTURING_PLAN_FOR_GOOD_REQUEST:
        case SalesOrderConstants.GET_SALES_ORDER_BY_MANUFACTURING_WORKS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case SalesOrderConstants.GET_ALL_SALES_ORDERS_FAILURE:
        case SalesOrderConstants.CREATE_SALES_ORDER_FAILURE:
        case SalesOrderConstants.EDIT_SALES_ORDER_FAILURE:
        case SalesOrderConstants.APPROVE_SALES_ORDER_FAILURE:
        case SalesOrderConstants.ADD_MANUFACTURING_PLAN_FOR_GOOD_FAILURE:
        case SalesOrderConstants.GET_SALES_ORDER_BY_MANUFACTURING_WORKS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
    
        case SalesOrderConstants.GET_ALL_SALES_ORDERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listSalesOrders: action.payload.allSalesOrders.docs,
                totalDocs: action.payload.allQuotes.totalDocs,
                limit: action.payload.allQuotes.limit,
                totalPages: action.payload.allQuotes.totalPages,
                page: action.payload.allQuotes.page,
                pagingCounter: action.payload.allQuotes.pagingCounter,
                hasPrevPage: action.payload.allQuotes.hasPrevPage,
                hasNextPage: action.payload.allQuotes.hasNextPage,
                prevPage: action.payload.allQuotes.prevPage,
                nextPage: action.payload.allQuotes.nextPage
            }
        
        case SalesOrderConstants.CREATE_SALES_ORDER_SUCCESS:
            return {
                ...state,
                listSalesOrders: [
                    ...state.listSalesOrders,
                    action.payload.salesOrder
                ],
                isLoading: false
            }
        
        case SalesOrderConstants.EDIT_SALES_ORDER_SUCCESS:
            index = findIndex(state.listSalesOrders, action.payload.salesOrder._id);
            if (index !== -1) {
                state.listSalesOrders[index] = action.payload.salesOrder
            }
            return {
                ...state,
                isLoading: false
            }
        
        case SalesOrderConstants.APPROVE_SALES_ORDER_SUCCESS:
            index = findIndex(state.listSalesOrders, action.payload.salesOrder._id);
            if (index !== -1) {
                state.listSalesOrders[index] = action.payload.salesOrder
            }
            return {
                ...state,
                isLoading: false
            }
        
        case SalesOrderConstants.ADD_MANUFACTURING_PLAN_FOR_GOOD_SUCCESS:
            index = findIndex(state.listSalesOrders, action.payload.salesOrder._id);
            if (index !== -1) {
                state.listSalesOrders[index] = action.payload.salesOrder
            }
            return {
                ...state,
                isLoading: false
            }
        
        case SalesOrderConstants.GET_SALES_ORDER_BY_MANUFACTURING_WORKS_SUCCESS:
            return {
                ...state,
                salesOrders: action.payload.salesOrders,
                isLoading: false
            }
        default:
            return state
    }
}