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
        url: `${ process.env.REACT_APP_SERVER }/crm/customer`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}

function createCustomer(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/crm/customer`,
        method: 'POST',
        data,
    }, true, true, 'customer');
}

function getCustomer(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/crm/customer/${id}`,
        method: 'GET',
    }, false, true, 'customer');
}

function editCustomer(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/crm/customer/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'customer');
}

function deleteCustomer(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/crm/customer/${id}`,
        method: 'DELETE',
    }, false, true, 'customer');
}
