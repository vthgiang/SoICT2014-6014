import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const LinkDefaultServices = {
    get,
    getCategories,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management`,
        method: 'GET'
    }, false, 'system_admin.system_link')
}

function getCategories() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/categories`,
        method: 'GET'
    }, false, 'system_admin.system_link');
}

function getPaginate(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/paginate`,
        method: 'POST',
        data
    }, false, 'system_admin.system_link');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'GET'
    }, false, 'system_admin.system_link');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management`,
        method: 'POST',
        data
    }, true, 'system_admin.system_link');
}

function edit(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'PATCH',
        data
    }, true, 'system_admin.system_link');
}

function destroy(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'DELETE'
    }, true, 'system_admin.system_link');
}