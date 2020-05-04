import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
import { TOKEN_SECRET } from '../../../../env';
import { getStorage } from '../../../../config';
import jwt from 'jsonwebtoken';

export const DepartmentServices = {
    get,
    create,
    edit,
    destroy,
    getAll,
    getDepartmentOfUser,
    getDepartmentsThatUserIsDean,
};

function get() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/department`,
        method: 'GET',
    }, false, true, 'super_admin.organization_unit');
}

function create(department) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/department`,
        method: 'POST',
        data: department,
    }, true, true, 'super_admin.organization_unit');
}

function edit(department) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/department/${department._id}`,
        method: 'PATCH',
        data: department,
    }, true, true, 'super_admin.organization_unit');
}

function destroy(departmentId) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/department/${departmentId}`,
        method: 'DELETE',
    }, true, true, 'super_admin.organization_unit');
}

function getAll() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/departments`,
        method: 'GET'
    }, false, true, 'super_admin.organization_unit');
}

async function getDepartmentOfUser() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/department/department-of-user/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.organization_unit');
}

async function getDepartmentsThatUserIsDean(currentRole) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${LOCAL_SERVER_API}/department/departments-that-user-is-dean/${id}`,
        method: 'GET',
    }, false, true, 'super_admin.organization_unit');
}

