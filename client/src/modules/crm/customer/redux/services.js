import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmCustomerServices = {
    getCustomers,
    createCustomer,
    getCustomer,
    editCustomer,
    deleteCustomer,
    importCustomers,
    getCustomerPoint,
    editCustomerPoint
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
