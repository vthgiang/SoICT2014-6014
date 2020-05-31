import {
    LOCAL_SERVER_API
} from '../../../../env';
import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const EducationService = {
    getListEducation,
    createNewEducation,
    deleteEducation,
    updateEducation,
}

/**
 * Lấy danh sách các chương trình đào tạo theo key
 * @data : dữ liệu của Key
 */
function getListEducation(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/educationPrograms`,
        method: 'GET',
        params: {
            organizationalUnit: data !== undefined ? data.organizationalUnit : data,
            position: data !== undefined ? data.position : data,
            page: data !== undefined ? data.page : data,
            limit: data !== undefined ? data.limit : data
        }
    }, false, true, 'training.education_program');
}

/**
 * Tạo mới một chương trình đào tạo
 * @data : Dữ liệu chương trình đào tạo cần tạo
 */
function createNewEducation(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/educationPrograms/`,
        method: 'POST',
        data: data,
    }, true, true, 'training.education_program');
}

/**
 * Xoá một chương trình đào tạo
 * @id : Id chương trình đào tạo cần xoá
 */
function deleteEducation(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/educationPrograms/${id}`,
        method: 'DELETE',
    }, true, true, 'training.education_program');
}

/**
 * Cập nhật thông tin chương trình đào tạo
 * @id : Id chương trình đào tạo cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa chương trình đào tạo
 */
function updateEducation(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/educationPrograms/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'training.education_program');
}