import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const RoleServices = {
    get,
    show,
    create,
    edit,
    destroy
};

function get(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'GET',
        params
    }, false, true, 'super_admin.role');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.role');
}

function create(role) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'POST',
        data: role,
    }, true, true, 'super_admin.role');
}

function edit(role) {
    let showAlert = role.showAlert === undefined ? true : false;
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role/${role.id}`,
        method: 'PATCH',
        data: role,
    }, showAlert, showAlert, 'super_admin.role');
}

function destroy(roleId) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role/${roleId}`,
        method: 'DELETE',
    }, true, true, 'super_admin.role');
}