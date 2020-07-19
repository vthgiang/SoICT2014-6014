import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const ComponentServices = {
    get,
    show,
    create,
    edit,
    destroy
};

function get(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component`,
        method: 'GET',
        params
    }, false, true, 'super_admin.component');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.component');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component`,
        method: 'POST',
        data,
    }, true, 'super_admin.component');
}

function edit(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'super_admin.component');
}

function destroy(id, component) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'DELETE',
    }, true, true, 'super_admin.component');
}