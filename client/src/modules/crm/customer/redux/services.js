import { sendRequest } from '../../../../helpers/requestHelper';

export const CustomerServices = {
    getCustomers,
    createCustomer,
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