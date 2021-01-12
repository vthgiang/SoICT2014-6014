import { sendRequest } from '../../../../../helpers/requestHelper';

export const PurchaseOrderServices = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    updatePurchaseOrder
}

function createPurchaseOrder(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/purchase-order`,
        method: 'POST',
        data
    }, true, true, 'manage_order.purchase_order');
}

function getAllPurchaseOrders(queryData){
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/purchase-order`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "manage_order.purchase_order")
}

function updatePurchaseOrder (id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/purchase-order/${id}`,
            method: "PATCH",
            data
        },
        true,
        true,
        "manage_order.purchase_order"
    )
}