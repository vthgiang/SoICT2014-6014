import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmCustomerRankPointServices = {
    getCustomerRankPoints,
    createCustomerRankPoint,
    getCustomerRankPoint,
    editCustomerRankPoint,
    deleteCustomerRankPoint,
};

function getCustomerRankPoints(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customerRankPoints`,
        method: 'GET',
        params,
    }, false, true, 'crm.customerRankPoint');
}

function createCustomerRankPoint(data) {
    console.log('vao service client');
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customerRankPoints`,
        method: 'POST',
        data,
    }, true, true, 'crm.customerRankPoint');
}

function getCustomerRankPoint(id) {
  
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customerRankPoints/${id}`,
        method: 'GET',
    }, false, true, 'crm.customerRankPoint');
}

function editCustomerRankPoint(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customerRankPoints/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'crm.customerRankPoint');
}
function deleteCustomerRankPoint(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/customerRankPoints/${id}`,
        method: 'DELETE',
    }, false, true, 'crm.customerRankPoint');
}
