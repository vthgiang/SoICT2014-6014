import { sendRequest } from "../../../../../helpers/requestHelper"

export const requestServices = {
    getAllRequestByCondition,
    createRequest,
    getDetailRequest,
    editRequest,
    getNumberStatus
}

function getAllRequestByCondition(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/request-management`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manufacturing.purchasing_request'
    )
}

function createRequest(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/request-management`,
            method: "POST",
            data
        },
        true,
        true,
        'manufacturing.purchasing_request'
    )
}

function getDetailRequest(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/request-management/${id}`,
            method: "GET",
        },
        false,
        true,
        'manufacturing.purchasing_request'
    )
}

function editRequest(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/request-management/${id}`,
            method: "PATCH",
            data
        },
        true,
        true,
        'manufacturing.purchasing_request'
    )
}

function getNumberStatus(query) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/request-management/get-number-request`,
            method: "GET",
            params: query
        },
        false,
        true,
        'manufacturing.purchasing_request'
    )
}
