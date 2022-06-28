import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const TagService = {
    getListTag,
    createTag,
    editTag,
    deleteTag
}
/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListTag(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/tags/tag`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.tag');
}

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu kỷ luật cần thêm 
 */
function createTag(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/tags/tag`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.tag');
}

//=============EDIT===============

/**
 * Chỉnh sửa chuyên ngành
 * @data : Dữ liệu
 */
function editTag(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/tags/tag/${data.tagId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.tag');
}

// =============DELETE===============

/**
 * Xóa chuyên ngành
 * @data : Dữ liệu xóa
 */
function deleteTag(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/tags/tag/${id}`,
        method: 'DELETE',
        // data: data
    }, true, true, 'human_resource.tag');
}