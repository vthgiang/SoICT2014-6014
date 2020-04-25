import { LOCAL_SERVER_API } from '../../../../env';
import { handleRequest } from '../../../../helpers/handleRequest';

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
    return handleRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management`,
        method: 'GET'
    }, false)
}

function getCategories() {
    return handleRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/categories`,
        method: 'GET'
    }, false);
}

function getPaginate(data) {  
    return handleRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/paginate`,
        method: 'POST',
        data
    }, false);
}

function show(id) {
    return handleRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'GET'
    });
}

function create(data) {
    return handleRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management`,
        method: 'POST',
        data
    });
}

function edit(id, data) {
    return handleRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'PATCH',
        data
    });
}

function destroy(id) {
    return handleRequest({
        url: `${ LOCAL_SERVER_API }/links-default-management/${id}`,
        method: 'DELETE'
    });
}