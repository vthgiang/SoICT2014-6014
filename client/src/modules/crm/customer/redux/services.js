import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmCustomerServices = {
    getCustomers,
    createCustomer,
    getCustomer,
    editCustomer,
    deleteCustomer,
};

function getCustomers(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}

function createCustomer(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers`,
        method: 'POST',
        data,
    }, true, true, 'customer');
}

function getCustomer(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}`,
        method: 'GET',
    }, false, true, 'customer');
}

function editCustomer(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'customer');
}

function deleteCustomer(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customers/${id}`,
        method: 'DELETE',
    }, false, true, 'customer');
}
