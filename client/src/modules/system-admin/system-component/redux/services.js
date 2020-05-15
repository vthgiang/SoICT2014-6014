import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const ComponentDefaultServices = {
    get,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management`,
        method: 'GET',
    }, false, true, 'system_admin.system_component');
}

function getPaginate(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management/paginate`,
        method: 'POST',
        data,
    }, false, true, 'system_admin.system_component');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'GET',
    }, false, true, 'system_admin.system_component');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.system_component');
}

function edit(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.system_component');
}

function destroy(id, component) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'DELETE',
    }, true, true, 'system_admin.system_component');
}