import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import { LOCAL_SERVER_API } from '../../../../env';
import {
    AuthenticateHeader
} from '../../../../config';
export const CourseService = {
    getListCourse,
    createNewCourse,
    deleteCourse,
    updateCourse,
}

// Lấy danh sách các chương trình đào tạo 
function getListCourse(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/educationProgram/paginate`, requestOptions).then(handleResponse);

}

// tạo mới một chương trình đào tạo
function createNewCourse(data) {
    const requestOptions ={
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/educationProgram/`, requestOptions).then(handleResponse);
}

// Xoá một chương trình đào tạo
function deleteCourse(numberEducation) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`${ LOCAL_SERVER_API }/educationProgram/${numberEducation}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin chương trình đào tạo
function updateCourse(numberEducation, data) {
    const requestOptions ={
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/educationProgram/${numberEducation}`, requestOptions).then(handleResponse);
}