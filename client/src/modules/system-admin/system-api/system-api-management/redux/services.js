import { sendRequest } from '../../../../../helpers/requestHelper';

export const SystemApiServices = {
    getSystemApis,
    createSystemApi,
    editSystemApi,
    deleteSystemApi,
    updateSystemApi
};

/** Lấy các system api */
function getSystemApis(params) {
    const { path, method, description, page, perPage } = params

    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-api/system-apis`,
        method: 'GET',
        params: {
            path,
            method,
            description,
            page, 
            perPage
        }
    }, false, true, 'system_admin.system_api');
}

/** Thêm mới system api 
 * @data gồm: path, method, description
*/
function createSystemApi(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-api/system-apis`,
        method: 'POST',
        data: data
    }, true, true, 'system_admin.system_api');
}

/** Chinh sua system api */
function editSystemApi (systemApiId, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-api/system-apis/${systemApiId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'system_admin.system_api');
}

/** Xoa system API */
function deleteSystemApi(systemApiId) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-api/system-apis/${systemApiId}`,
        method: 'DELETE',
    }, true, true, 'system_admin.system_api');
}

function updateSystemApi() {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/system-api/system-apis/update-auto`,
        method: 'POST',
    }, true, true, 'system_admin.system_api');
}