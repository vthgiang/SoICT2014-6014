import { SalesOrderConstants } from "./constants"
import { SalesOrderSevices } from "./services";

export const SalesOrderActions = {
    createNewSalesOrder,
    getAllSalesOrders,
    editSalesOrder,
    approveSalesOrder,
    addManufacturingPlanForGood,
    getSalesOrdersByManufacturingWorks,
    getSalesOrdersForPayment,
    getSalesOrderDetail,
    countSalesOrder,
    getTopGoodsSold,
    getSalesForDepartments
}

function createNewSalesOrder (data) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.CREATE_SALES_ORDER_REQUEST
        });
        SalesOrderSevices.createNewSalesOrder(data)
        .then((res) => {
            dispatch({
                type: SalesOrderConstants.CREATE_SALES_ORDER_SUCCESS,
                payload: res.data.content
            });
        })
        .catch((error) => {
            dispatch({
                type: SalesOrderConstants.CREATE_SALES_ORDER_FAILURE,
                error
            });
        });
    }
}

function getAllSalesOrders(queryData) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.GET_ALL_SALES_ORDERS_REQUEST
        })
        SalesOrderSevices.getAllSalesOrders(queryData)
            .then((res) => {
            dispatch({
                type: SalesOrderConstants.GET_ALL_SALES_ORDERS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: SalesOrderConstants.GET_ALL_SALES_ORDERS_FAILURE,
                error
            })
        })
    }
}

function editSalesOrder (id, data) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.EDIT_SALES_ORDER_REQUEST
        })

        SalesOrderSevices.editSalesOrder(id, data)
        .then((res) => {
            dispatch({
                type: SalesOrderConstants.EDIT_SALES_ORDER_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: SalesOrderConstants.EDIT_SALES_ORDER_FAILURE,
                error
            })
        })
    }
}

function approveSalesOrder(id, data) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.APPROVE_SALES_ORDER_REQUEST
        })

        SalesOrderSevices.approveSalesOrder(id, data)
        .then((res) => {
            dispatch({
                type: SalesOrderConstants.APPROVE_SALES_ORDER_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: SalesOrderConstants.APPROVE_SALES_ORDER_FAILURE,
                error
            })
        })
    }
}


/**
 * Lên kế hoạch sản xuất cho từng hàng hóa trong đơn
 * @param {*} id id đơn hàng
 * @param {*} data là 1 array: [{goodId: ObjecId, manufacturingPlanId: ObjectId}] 
 */
function addManufacturingPlanForGood (id, data) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.ADD_MANUFACTURING_PLAN_FOR_GOOD_REQUEST
        })

        SalesOrderSevices.addManufacturingPlanForGood(id, data)
        .then((res) => {
            dispatch({
                type: SalesOrderConstants.ADD_MANUFACTURING_PLAN_FOR_GOOD_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: SalesOrderConstants.ADD_MANUFACTURING_PLAN_FOR_GOOD_FAILURE,
                error
            })
        })
    }
}

/**
 * Lấy các đơn hàng cần lập kế hoạch sản xuất theo nhà máy (chỉ lấy những mặt hàng nhà máy có thể sản xuất)
 * @param {*} id id nhà máy
 */
function getSalesOrdersByManufacturingWorks (id) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.GET_SALES_ORDER_BY_MANUFACTURING_WORKS_REQUEST
        })

        SalesOrderSevices.getSalesOrdersByManufacturingWorks(id)
        .then((res) => {
            dispatch({
                type: SalesOrderConstants.GET_SALES_ORDER_BY_MANUFACTURING_WORKS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: SalesOrderConstants.GET_SALES_ORDER_BY_MANUFACTURING_WORKS_FAILURE,
                error
            })
        })
    }
}

function getSalesOrdersForPayment (customerId) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.GET_SALES_ORDERS_FOR_PAYMENT_REQUEST
        })

        SalesOrderSevices.getSalesOrdersForPayment(customerId)
        .then((res) => {
            dispatch({
                type: SalesOrderConstants.GET_SALES_ORDERS_FOR_PAYMENT_SUCCESS,
                payload: res.data.content
            })
        })
        .catch((error) => {
            dispatch({
                type: SalesOrderConstants.GET_SALES_ORDERS_FOR_PAYMENT_FAILURE,
                error
            })
        })
    }
}

function getSalesOrderDetail(id) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.GET_SALES_ORDER_DETAIL_REQUEST
        })

        SalesOrderSevices.getSalesOrderDetail(id)
            .then((res) => {
                dispatch({
                    type: SalesOrderConstants.GET_SALES_ORDER_DETAIL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch((error) => {
                dispatch({
                    type: SalesOrderConstants.GET_SALES_ORDER_DETAIL_FAILURE,
                    error
                })
            })
    }
}

// PHẦN SERVICE CHO DASHBOARD

function countSalesOrder(queryData) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.COUNT_SALES_ORDER_REQUEST
        })

        SalesOrderSevices.countSalesOrder(queryData)
            .then((res) => {
                dispatch({
                    type: SalesOrderConstants.COUNT_SALES_ORDER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch((error) => {
                dispatch({
                    type: SalesOrderConstants.COUNT_SALES_ORDER_FAILURE,
                    error
                })
            })
    }
}

function getTopGoodsSold(queryData) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.GET_TOP_GOODS_SOLD_REQUEST
        })

        SalesOrderSevices.getTopGoodsSold(queryData)
            .then((res) => {
                dispatch({
                    type: SalesOrderConstants.GET_TOP_GOODS_SOLD_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch((error) => {
                dispatch({
                    type: SalesOrderConstants.GET_TOP_GOODS_SOLD_FAILURE,
                    error
                })
            })
    }
}

function getSalesForDepartments(queryData) {
    return (dispatch) => {
        dispatch({
            type: SalesOrderConstants.GET_SALES_FOR_DEPARTMENTS_REQUEST
        })

        SalesOrderSevices.getSalesForDepartments(queryData)
            .then((res) => {
                dispatch({
                    type: SalesOrderConstants.GET_SALES_FOR_DEPARTMENTS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch((error) => {
                dispatch({
                    type: SalesOrderConstants.GET_SALES_FOR_DEPARTMENTS_FAILURE,
                    error
                })
            })
    }
}
