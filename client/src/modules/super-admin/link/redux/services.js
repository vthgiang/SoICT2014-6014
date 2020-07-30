import {
    LOCAL_SERVER_API
} from '../../../../env';
import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const LinkServices = {
    get,
    show,
    create,
    edit,
    destroy,
};

function get(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/links`,
        method: 'GET',
        params
    }, false, true, 'super_admin.link');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/links/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.link');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/links`,
        method: 'POST',
        data,
    }, true, true, 'super_admin.link');
}

function edit(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/links/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'super_admin.link');
}

function destroy(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/link/links/${id}`,
        method: 'DELETE',
    }, true, true, 'super_admin.link');
}