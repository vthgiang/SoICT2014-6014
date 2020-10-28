import { sendRequest } from "../../../../../helpers/requestHelper"

export const purchasingRequestServices = {
    getAllPurchasingRequests,
}

function getAllPurchasingRequests(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/purchasing-request`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manufacturing.purchasing_request'
    )
}