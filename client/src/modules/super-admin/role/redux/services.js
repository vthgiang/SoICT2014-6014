import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const RoleServices = {
    get,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get() {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'GET',
    }, false, 'super_admin.role');
}

function getPaginate(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role/paginate`,
        method: 'POST',
        data,
    }, false, 'super_admin.role');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role/${id}`,
        method: 'GET',
    }, false, 'super_admin.role');
}

function create(role) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role`,
        method: 'POST',
        data: role,
    }, true, 'super_admin.role');
}

function edit(role) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role/${role.id}`,
        method: 'PATCH',
        data: role,
    }, true, 'super_admin.role');
}

function destroy(roleId) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/role/${roleId}`,
        method: 'DELETE',
    }, true, 'super_admin.role');
}