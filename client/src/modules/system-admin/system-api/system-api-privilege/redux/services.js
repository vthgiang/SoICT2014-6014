import { sendRequest } from '../../../../../helpers/requestHelper';

export const PrivilegeApiServices = {
    getPrivilegeApis,
    createPrivilegeApi,
};

/** Thêm mới system api 
 * @data gồm: path, method, description
*/
function createPrivilegeApi(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/privilege-api/privilege-apis`,
        method: 'POST',
        data: data
    }, true, true, 'system_admin.system_api');
}

function getPrivilegeApis(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/system-admin/privilege-api/privilege-apis`,
        method: 'GET',
        params: data
    }, false, true, 'system_admin.system_api');
}
