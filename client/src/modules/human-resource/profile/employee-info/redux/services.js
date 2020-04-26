import axios from 'axios';
import { TOKEN_SECRET, LOCAL_SERVER_API } from '../../../../../env';
import { AuthenticateHeader, getStorage } from '../../../../../config';
import jwt from 'jsonwebtoken';

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
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/employee/${email}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

/**
 * Cập nhật thông tin cá nhân
 */
async function updatePersonalInformation(data) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var email = verified.email;
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/employee/${email}`,
        method: 'PUT',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}