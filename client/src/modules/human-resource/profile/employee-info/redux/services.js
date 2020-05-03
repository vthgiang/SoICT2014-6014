
import { TOKEN_SECRET, LOCAL_SERVER_API } from '../../../../../env';
import { getStorage } from '../../../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest } from '../../../../../helpers/requestHelper';

export const EmployeeService = {
    getEmployeeProfile,
    updatePersonalInformation,
}

/**
 * Lấy thông tin cá nhân
 */ 
async function getEmployeeProfile() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var email = verified.email;
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employee/${email}`,
        method: 'GET',
    }, false, 'human_resource.profile.employee_info');
}

/**
 * Cập nhật thông tin cá nhân
 * @data : dữ liệu cập nhật thông tin cá nhân
 */
async function updatePersonalInformation(data) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var email = verified.email;
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employee/${email}`,
        method: 'PUT',
        data: data,
    }, true, 'human_resource.profile.employee_info');
}