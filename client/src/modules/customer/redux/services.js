import { LOCAL_SERVER_API } from '../../../env';
import { sendRequest } from '../../../helpers/requestHelper';

export const CustomerServices = {
    // Customer
    getCustomers,

    // Customer group
    getCustomerGroups,
};

function getCustomers(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/customer`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}

function getCustomerGroups(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/customer/group`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}