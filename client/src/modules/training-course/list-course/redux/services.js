import {
    handleResponse
} from '../../../../helpers/HandleResponse';
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/educationProgram/paginate`, requestOptions).then(handleResponse);

}

// tạo mới một chương trình đào tạo
function createNewCourse(data) {
    const requestOptions ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/educationProgram/`, requestOptions).then(handleResponse);
}

// Xoá một chương trình đào tạo
function deleteCourse(numberEducation) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/educationProgram/${numberEducation}`, requestOptions).then(handleResponse);
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
    return fetch(`/educationProgram/${numberEducation}`, requestOptions).then(handleResponse);
}