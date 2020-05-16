
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
    var id = getStorage("userId");
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/personals/${id}`,
        method: 'GET',
    }, false, true, 'human_resource.profile.employee_info');
}

/**
 * Cập nhật thông tin cá nhân
 * @data : dữ liệu cập nhật thông tin cá nhân
 */
async function updatePersonalInformation(data) {
    var id = getStorage("userId");
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/personals/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.profile.employee_info');
}