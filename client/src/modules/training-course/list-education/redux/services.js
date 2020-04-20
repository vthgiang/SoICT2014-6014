import {
    handleResponse
} from '../../../../helpers/handleResponse';
import { LOCAL_SERVER_API } from '../../../../env';
import {
    AuthenticateHeader
} from '../../../../config';
export const EducationService = {
    getAll,
    getListEducation,
    createNewEducation,
    deleteEducation,
    updateEducation,
}

// Lấy danh sách tất cả các chương trình đào tạo 
function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/educationProgram/`, requestOptions).then(handleResponse);

}

// Lấy danh sách các chương trình đào tạo 
function getListEducation(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/educationProgram/paginate`, requestOptions).then(handleResponse);

}

// tạo mới một chương trình đào tạo
function createNewEducation(data) {
    const requestOptions ={
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/educationProgram/`, requestOptions).then(handleResponse);
}

// Xoá một chương trình đào tạo
function deleteEducation(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/educationProgram/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin chương trình đào tạo
function updateEducation(id, data) {
    const requestOptions ={
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/educationProgram/${id}`, requestOptions).then(handleResponse);
}