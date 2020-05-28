import {
    LOCAL_SERVER_API
} from '../../../../env';
import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const CourseService = {
    getListCourse,
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
        url: `${ LOCAL_SERVER_API }/courses`,
        method: 'GET',
        params: {
            courseId: data.courseId,
            type: data.type,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'training.course');
}

/**
 * Tạo mới một khoá đào tạo
 * @data : Dữ liệu khoá đào tạo
 */
function createNewCourse(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/courses/`,
        method: 'POST',
        data: data,
    }, true, true, 'training.course');
}

/**
 * Xoá khoá đào tạo
 * @id : Id khoá đào tạo cần xoá
 */
// 
function deleteCourse(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/courses/${id}`,
        method: 'DELETE',
    }, true, true, 'training.course');
}

/**
 * Cập nhật thông tin khoá đào tạo
 * @id : id khoá đào tạo cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa khoá đào tạo
 */
function updateCourse(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/courses/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'training.course');
}