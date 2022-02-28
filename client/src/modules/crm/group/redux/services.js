import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmGroupServices = {
    getGroups,
    createGroup,
    getGroup,
    editGroup,
    deleteGroup,
    addPromotion,
    editPromotion,
    deletePromotion,
    getMembersGroup
};

function getGroups(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups`,
        method: 'GET',
        params,
    }, false, true, 'crm.group');
}

function createGroup(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups`,
        method: 'POST',
        data
    }, true, true, 'crm.group');
}

function getGroup(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'GET'
    }, false, true, 'group');
}

function editGroup(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'crm.group');
}

function deleteGroup(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}`,
        method: 'DELETE'
    }, false, true, 'crm.group');
}

function addPromotion(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}/promotion`,
        method: 'POST',
        data
    }, true, true, 'crm.group');
}

function editPromotion(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}/promotion`,
        method: 'PATCH',
        data
    }, true, true, 'crm.group');
}

function deletePromotion(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}/promotion`,
        method: 'DELETE',
        data
    }, false, true, 'crm.group');
}

function getMembersGroup(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/groups/${id}/members`,
        method: 'GET'
    }, false, true, 'group');
}
