import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import {
    TOKEN_SECRET,
    LOCAL_SERVER_API
} from '../../../../env';
import {
    AuthenticateHeader,
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';

export const EmployeeService = {
    getInformationPersonal,
    updateInformationPersonal,
}

// lấy thông tin cá nhân
async function getInformationPersonal() {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var email = verified.email;
    const requestOptions = {
        method: 'GET',
    }
    return fetch(`${ LOCAL_SERVER_API }/employee/${email}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin cá nhân
async function updateInformationPersonal(information) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var email = verified.email;
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(information)
    };
    return fetch(`${ LOCAL_SERVER_API }/employee/${email}`, requestOptions).then(handleResponse);
}