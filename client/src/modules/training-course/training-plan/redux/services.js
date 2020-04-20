import {
    handleResponse
} from '../../../../helpers/handleResponse';
import { LOCAL_SERVER_API } from '../../../../env';
import {
    AuthenticateHeader
} from '../../../../config';
export const CourseService = {
    getListCourse,
    getCourseByEducation,
    createNewCourse,
    deleteCourse,
    updateCourse,
}

// Lấy danh sách các khoá đào tạo 
function getListCourse(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/course/paginate`, requestOptions).then(handleResponse);

}

// Lấy danh sách các khoá đào tạo theo chương trình đào tạo
function getCourseByEducation(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/course/list`, requestOptions).then(handleResponse);

}

// tạo mới một khoá đào tạo
function createNewCourse(data) {
    const requestOptions ={
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/course/`, requestOptions).then(handleResponse);
}

// Xoá một khoá đào tạo
function deleteCourse(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/course/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin khoá đào tạo
function updateCourse(id, data) {
    const requestOptions ={
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/course/${id}`, requestOptions).then(handleResponse);
}