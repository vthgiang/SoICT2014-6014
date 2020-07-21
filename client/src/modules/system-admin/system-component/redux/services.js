import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const SystemComponentServices = {
    getAllSystemComponents,
    getSystemComponent,
    createSystemComponent,
    editSystemComponent,
    deleteSystemComponent
};

function getAllSystemComponents(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management`,
        method: 'GET',
        params
    }, false, true, 'system_admin.system_component');
}

function getSystemComponent(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'GET',
    }, false, true, 'system_admin.system_component');
}

function createSystemComponent(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.system_component');
}

function editSystemComponent(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.system_component');
}

function deleteSystemComponent(id, component) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/components-default-management/${id}`,
        method: 'DELETE',
    }, true, true, 'system_admin.system_component');
}