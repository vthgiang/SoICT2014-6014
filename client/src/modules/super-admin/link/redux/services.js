import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const LinkServices = {
    get,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link`,
        method: 'GET',
    }, false, 'super_admin.link');
}

function getPaginate(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/paginate`,
        method: 'POST',
        data,
    }, false, 'super_admin.link');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'GET',
    }, false, 'super_admin.link');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link`,
        method: 'POST',
        data,
    }, true, 'super_admin.link');
}

function edit(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'PATCH',
        data,
    }, true, 'super_admin.link');
}

function destroy(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/${id}`,
        method: 'DELETE',
    }, true, 'super_admin.link');
}