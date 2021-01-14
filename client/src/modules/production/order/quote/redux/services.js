import { sendRequest } from '../../../../../helpers/requestHelper';

export const QuoteServices = {
    createNewQuote,
    getAllQuotes,
    editQuote,
    deleteQuote,
    approveQuote,
    getQuotesToMakeOrder
}

function createNewQuote(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/quote`,
            method: "POST",
            data
        },
        true,
        true,
        "manage_order.quote")
}

function getAllQuotes (queryData){
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/quote`,
            method: "GET",
            params: queryData
        },
        false,
        true,
        "manage_order.quote")
}

function editQuote (id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/quote/${id}`,
        method: "PATCH",
        data
    },
        true,
        true,
    "manage_order.quote")
}

function deleteQuote (id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/quote/${id}`,
        method: "DELETE"
    },
        true,
        true,
    "manage_order.quote")
}

function approveQuote(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/quote/approve/${id}`,
        method: "PATCH",
        data
    },
        false,
        true,
    "manage_order.quote")
}

function getQuotesToMakeOrder() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/quote/get-to-make-order`,
        method: "GET",
    },
        false,
        true,
    "manage_order.quote")
}