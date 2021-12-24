import { sendRequest } from "../../../../../helpers/requestHelper";

export const PurchaseInvoiceService = {
    searchPurchaseInvoice,
    createPurchaseInvoices,
    updatePurchaseInvoice,
    deletePurchaseInvoices,
    getPurchaseInvoiceById,
};

function searchPurchaseInvoice(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-invoice/purchase-invoice`,
        method: 'GET',
        params: {
            codeInvoice: data.codeInvoice,
            supplies: data.supplies,
            date: data.date,
            supplier: data.supplier,
            page: data.page,
            limit: data.limit
        },
    },
    false,
    true,
    'supplies.invoice_management');
}

function createPurchaseInvoices(data) {
    console.log("hang createPurchaseInvoices", data);
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-invoice/purchase-invoice`,
        method: 'POST',
        data: data,
    },
    true,
    true,
    'supplies.invoice_management');
}

function updatePurchaseInvoice(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-invoice/purchase-invoice/${id}`,
        method: 'PATCH',
        data: data,
    },
    true,
    true,
    'supplies.supplies_management');
}

function deletePurchaseInvoices(ids) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-invoice/purchase-invoice`,
        method: 'DELETE',
        data: ids,
    },
    true,
    true,
    'supplies.invoice_management');
}

function getPurchaseInvoiceById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/purchase-invoice/purchase-invoice/${id}`,
        method: 'GET',
    },
    false,
    true,
    'supplies.invoice_management');
}