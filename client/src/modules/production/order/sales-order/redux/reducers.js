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
    salesOrderDetail: {},
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
        case SalesOrderConstants.GET_SALES_ORDERS_FOR_PAYMENT_REQUEST:
        case SalesOrderConstants.GET_SALES_ORDER_DETAIL_REQUEST:
        case SalesOrderConstants.COUNT_SALES_ORDER_REQUEST:
        case SalesOrderConstants.GET_TOP_GOODS_SOLD_REQUEST:
        case SalesOrderConstants.GET_SALES_FOR_DEPARTMENTS_REQUEST:
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
        case SalesOrderConstants.GET_SALES_ORDERS_FOR_PAYMENT_FAILURE:
        case SalesOrderConstants.GET_SALES_ORDER_DETAIL_FAILURE:
        case SalesOrderConstants.COUNT_SALES_ORDER_FAILURE:
        case SalesOrderConstants.GET_TOP_GOODS_SOLD_FAILURE:
        case SalesOrderConstants.GET_SALES_FOR_DEPARTMENTS_FAILURE:
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
                totalDocs: action.payload.allSalesOrders.totalDocs,
                limit: action.payload.allSalesOrders.limit,
                totalPages: action.payload.allSalesOrders.totalPages,
                page: action.payload.allSalesOrders.page,
                pagingCounter: action.payload.allSalesOrders.pagingCounter,
                hasPrevPage: action.payload.allSalesOrders.hasPrevPage,
                hasNextPage: action.payload.allSalesOrders.hasNextPage,
                prevPage: action.payload.allSalesOrders.prevPage,
                nextPage: action.payload.allSalesOrders.nextPage
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
                listSalesOrdersWorks: action.payload.salesOrders,
                isLoading: false
            }
        case SalesOrderConstants.GET_SALES_ORDERS_FOR_PAYMENT_SUCCESS:
            return {
                ...state,
                salesOrdersForPayment: action.payload.salesOrders,
                isLoading: false
            }
        case SalesOrderConstants.GET_SALES_ORDER_DETAIL_SUCCESS:
            return {
                ...state,
                salesOrderDetail: action.payload.salesOrder,
                isLoading: false
            }
        case SalesOrderConstants.COUNT_SALES_ORDER_SUCCESS:
            return {
                ...state,
                salesOrdersCounter: action.payload.salesOrdersCounter,
                isLoading: false
            }
        case SalesOrderConstants.GET_TOP_GOODS_SOLD_SUCCESS:
            return {
                ...state,
                topGoodsSold: action.payload.topGoodsSold,
                isLoading: false
        }
        case SalesOrderConstants.GET_SALES_FOR_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                salesForDepartments: action.payload.salesForDepartments,
                isLoading: false
            }
        default:
            return state
    }
}