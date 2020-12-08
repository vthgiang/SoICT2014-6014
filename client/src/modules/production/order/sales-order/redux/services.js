import { sendRequest } from "../../../../../helpers/requestHelper"

export const salesOrderSevices = {
    getAllSalesOrder,
}

function getAllSalesOrder() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/sales-order`,
            method: "GET"
        },
        false,
        true,
        "manage_order")
}