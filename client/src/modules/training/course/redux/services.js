import {
    LOCAL_SERVER_API
} from '../../../../env';
import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const CourseService = {
    getListCourse,
    getCourseByEducation,
    createNewCourse,
    deleteCourse,
    updateCourse,
}
/**
 * Lấy danh sách các khoá đào tạo 
 * @data : dữ liệu key tìm kiếm
 */
function getListCourse(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/course/paginate`,
        method: 'POST',
        data: data,
    }, false, true, 'human_resource.salary');
}

/**
 * Lấy danh sách các khoá đào tạo theo chương trình đào tạo
 * @data :  
 */
function getCourseByEducation(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/course/list`,
        method: 'POST',
        data: data,
    }, false, true, 'human_resource.salary');
}

/**
 * Tạo mới một khoá đào tạo
 * @data : Dữ liệu khoá đào tạo
 */
function createNewCourse(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/course/`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.salary');
}

/**
 * Xoá khoá đào tạo
 * @id : Id khoá đào tạo cần xoá
 */
// 
function deleteCourse(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/course/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.salary');
}

/**
 * Cập nhật thông tin khoá đào tạo
 * @id : id khoá đào tạo cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa khoá đào tạo
 */
function updateCourse(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/course/${id}`,
        method: 'PUT',
        data: data,
    }, true, true, 'human_resource.salary');
}