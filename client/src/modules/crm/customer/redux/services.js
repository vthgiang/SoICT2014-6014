import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmCustomerServices = {
    getCustomers,
    createCustomer,
    getCustomer,
    editCustomer,
    deleteCustomer,
    importCustomers,
    getCustomerPoint,
    editCustomerPoint,
    addPromotion,
    getCustomerPromotions,
    editPromotion,
    deletePromotion,
    usePromotion

};

function getCustomers(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers`,
        method: 'GET',
        params,
    }, false, true, 'crm.customer');
}

function createCustomer(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers`,
        method: 'POST',
        data,
    }, true, true, 'crm.customer');
}


function importCustomers(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/imports`,
        method: 'POST',
        data,
    }, true, true, 'crm.customer');
}

function getCustomer(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}`,
        method: 'GET',
    }, false, true, 'crm.customer');
}

function editCustomer(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'crm.customer');
}

function deleteCustomer(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}`,
        method: 'DELETE',
    }, false, true, 'crm.customer');
}

function getCustomerPoint(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}/point`,
        method: 'GET',
    }, false, true, 'crm.customer');
}


function editCustomerPoint(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}/point`,
        method: 'PATCH',
        data
    }, false, true, 'crm.customer');
}




function editPromotion(id, data) {
    console.log('vao edit service');
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}/promotion`,
        method: 'PATCH',
        data
    }, true, true, 'crm.customer');
}

function getCustomerPromotions(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}/promotions`,
        method: 'GET',
    }, false, true, 'crm.customer');
}

function addPromotion(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}/promotion`,
        method: 'POST',
        data
    }, true, true, 'crm.customer');
}
function usePromotion(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}/promotion/use`,
        method: 'PATCH',
        data
    }, true, true, 'crm.customer');
}
function deletePromotion(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}/promotion`,
        method: 'DELETE',
        data
    }, true, true, 'crm.customer');
}
