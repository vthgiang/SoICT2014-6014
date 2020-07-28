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
        url: `${ LOCAL_SERVER_API }/component/components`,
        method: 'GET',
        params
    }, false, true, 'super_admin.component');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/components/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.component');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/components`,
        method: 'POST',
        data,
    }, true, 'super_admin.component');
}

function edit(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/components/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'super_admin.component');
}

function destroy(id, component) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/components/${id}`,
        method: 'DELETE',
    }, true, true, 'super_admin.component');
}