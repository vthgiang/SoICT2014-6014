import { LOCAL_SERVER_API } from '../../../env';
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
        url: `${ LOCAL_SERVER_API }/customer`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}

function createCustomer(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/customer`,
        method: 'POST',
        data,
    }, true, true, 'customer');
}

function getCustomerGroups(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/customer/group`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}

function getLocations() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/customer/location`,
        method: 'GET'
    }, false, true, 'customer');
}