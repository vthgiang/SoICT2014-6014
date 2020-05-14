
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
    // const token = getStorage();
    // const verified = await jwt.verify(token, TOKEN_SECRET);
    // var email = verified.email;
    // TODO: Không lấy email theo cách này nữa. Có thể đổi request param thành id???
    var email="";
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employee/${email}`,
        method: 'GET',
    }, false, true, 'human_resource.profile.employee_info');
}

/**
 * Cập nhật thông tin cá nhân
 * @data : dữ liệu cập nhật thông tin cá nhân
 */
async function updatePersonalInformation(data) {
    // const token = getStorage();
    // const verified = await jwt.verify(token, TOKEN_SECRET);
    // var email = verified.email;
    // TODO: Không lấy email theo cách này nữa. Có thể đổi request param thành id???
    var email="";
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employee/${email}`,
        method: 'PUT',
        data: data,
    }, true, true, 'human_resource.profile.employee_info');
}