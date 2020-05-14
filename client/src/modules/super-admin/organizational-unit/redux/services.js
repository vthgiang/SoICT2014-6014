import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
import { getStorage } from '../../../../config';

export const DepartmentServices = {
    get,
    create,
    edit,
    destroy,
    getDepartmentsThatUserIsDean,
};

function get() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/organizational-units`,
        method: 'GET',
    }, false, true, 'super_admin.organization_unit');
}

function create(department) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/organizational-units`,
        method: 'POST',
        data: department,
    }, true, true, 'super_admin.organization_unit');
}

function edit(department) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/organizational-units/${department._id}`,
        method: 'PATCH',
        data: department,
    }, true, true, 'super_admin.organization_unit');
}

function destroy(departmentId) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/organizational-units/${departmentId}`,
        method: 'DELETE',
    }, true, true, 'super_admin.organization_unit');
}


async function getDepartmentsThatUserIsDean(currentRole) {
    var id = getStorage('userId');

    return sendRequest({
        url: `${LOCAL_SERVER_API}/organizational-units`,
        method: 'GET',
        params: {deanOfOrganizationalUnit: id}
    }, false, true, 'super_admin.organization_unit');
}

