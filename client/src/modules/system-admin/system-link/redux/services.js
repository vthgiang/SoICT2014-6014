import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const SystemLinkServices = {
    getAllSystemLinks,
    getAllSystemLinkCategories,
    getSystemLink,
    createSystemLink,
    editSystemLink,
    deleteSystemLink
};

function getAllSystemLinks(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management`,
        method: 'GET',
        params
    }, false, true, 'system_admin.system_link')
}

function getAllSystemLinkCategories() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/categories`,
        method: 'GET'
    }, false, true, 'system_admin.system_link');
}

function getPaginate(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/paginate`,
        method: 'POST',
        data
    }, false, true, 'system_admin.system_link');
}

function getSystemLink(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'GET'
    }, false, true, 'system_admin.system_link');
}

function createSystemLink(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management`,
        method: 'POST',
        data
    }, true, true, 'system_admin.system_link');
}

function editSystemLink(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'PATCH',
        data
    }, true, true, 'system_admin.system_link');
}

function deleteSystemLink(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'DELETE'
    }, true, true, 'system_admin.system_link');
}