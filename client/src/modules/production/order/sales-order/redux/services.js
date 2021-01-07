import { sendRequest } from "../../../../../helpers/requestHelper"

export const SalesOrderSevices = {
    createNewSalesOrder,
    getAllSalesOrders,
    editSalesOrder,
    approveSalesOrder,
    addManufacturingPlanForGood,
    getSalesOrdersByManufacturingWorks
}

function createNewSalesOrder(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/sales-order`,
            method: "POST",
            data
        },
        true,
        true,
        "manage_order.sales_order")
}

function getAllSalesOrders(queryData){
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/sales-order`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "manage_order.sales_order")
}

function editSalesOrder(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/sales-order/${id}`,
        method: "PATCH",
        data
    },
        true,
        true,
    "manage_order.sales_order")
}

function approveSalesOrder(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/sales-order/approve/${id}`,
        method: "PATCH",
        data
    },
        false,
        true,
    "manage_order.sales_order")
}

function addManufacturingPlanForGood(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/sales-order/add-manufacturing-plan/${id}`,
        method: "PATCH",
        data
    },
        false,
        true,
    "manage_order.sales_order")
}

function getSalesOrdersByManufacturingWorks(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/sales-order/get-by-manufacturing-works/${id}`,
        method: "GET"
    },
        false,
        true,
    "manage_order.sales_order")
}

