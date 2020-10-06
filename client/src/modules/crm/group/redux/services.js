import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmGroupServices = {
    getGroups,
    createGroup,
    getGroup,
    editGroup,
    deleteGroup
};

function getGroups(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups`,
        method: 'GET',
        params,
    }, false, true, 'customer');
}

function createGroup(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups`,
        method: 'POST',
        data
    }, true, true, 'customer');
}

function getGroup(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'GET'
    }, false, true, 'customer');
}

function editGroup(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'PATCH',
        data
    }, false, true, 'customer');
}

function deleteGroup(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'DELETE'
    }, false, true, 'customer');
}