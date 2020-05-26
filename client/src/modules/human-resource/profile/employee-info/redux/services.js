
import { LOCAL_SERVER_API } from '../../../../../env';
import { getStorage } from '../../../../../config';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const EmployeeService = {
    getEmployeeProfile,
    updatePersonalInformation,
}

/**
 * Lấy thông tin cá nhân
 */ 
async function getEmployeeProfile() {
    var userId = getStorage("userId");
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/${userId}`,
        method: 'GET',
    }, false, true, 'human_resource.profile.employee_info');
}

/**
 * Cập nhật thông tin cá nhân
 * @data : dữ liệu cập nhật thông tin cá nhân
 */
async function updatePersonalInformation(data) {
    var userId = getStorage("userId");
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/${userId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.profile.employee_info');
}