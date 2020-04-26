import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const ComponentServices = {
    get,
    getPaginate,
    show,
    create,
    edit,
    destroy
};

function get() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component`,
        method: 'GET',
    }, false, 'super_admin.component');
}

function getPaginate(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/paginate`,
        method: 'POST',
        data,
    }, false, 'super_admin.component');
}

function show(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'GET',
    }, false, 'super_admin.component');
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
    }, true, 'super_admin.component');
}

function destroy(id, component) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/component/${id}`,
        method: 'DELETE',
    }, true, 'super_admin.component');
}