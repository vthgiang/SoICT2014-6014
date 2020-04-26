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
    }, false)
}

function getCategories() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/categories`,
        method: 'GET'
    }, false);
}

function getPaginate(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/paginate`,
        method: 'POST',
        data
    }, false);
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'GET'
    });
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management`,
        method: 'POST',
        data
    });
}

function edit(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'PATCH',
        data
    });
}

function destroy(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'DELETE'
    });
}