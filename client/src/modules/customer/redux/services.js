import { sendRequest } from '../../../helpers/requestHelper';

export const CustomerServices = {
    // Customer
    getCustomers,
    createCustomer,

    // Customer group
    getCustomerGroups,

    getLocations
};

function getCustomers(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/customer`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}

function createCustomer(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/customer`,
        method: 'POST',
        data,
    }, true, true, 'customer');
}

function getCustomerGroups(params) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/customer/group`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}

function getLocations() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/customer/location`,
        method: 'GET'
    }, false, true, 'customer');
}