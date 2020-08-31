import { sendRequest } from '../../../../helpers/requestHelper';

export const CustomerServices = {
    getCustomerGroups,

    getLocations
};

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