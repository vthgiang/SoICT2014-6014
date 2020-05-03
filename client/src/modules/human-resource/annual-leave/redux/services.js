import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const AnnualLeaveService = {
    searchAnnualLeaves,
    createAnnualLeave,
    deleteAnnualLeave,
    updateAnnualLeave,
}

/**
 * Lấy danh sách nghỉ phép
 * @data : dữ liệu key tìm kiếm
 */ 
function searchAnnualLeaves(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/sabbatical/paginate`,
        method: 'POST',
        data: data
    }, false, 'human_resource.annual_leave');
}

/**
 * Tạo mới thông tin nghỉ phép
 * @data : Dữ liệu tạo mới thông tin nghỉ phép
 */
function createAnnualLeave(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/sabbatical/create`,
        method: 'POST',
        data: data
    }, true, 'human_resource.annual_leave');
}

/**
 * Xoá thông tin nghỉ phép
 * @id: Id nghỉ phép cần xoá
 */
function deleteAnnualLeave(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/sabbatical/${id}`,
        method: 'DELETE',
    }, true, 'human_resource.annual_leave');
}
/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép cần cập nhật 
 * @data  : dữ liệu cập nhật nghỉ phép
 */
function updateAnnualLeave(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/sabbatical/${id}`,
        method: 'PUT',
        data: data
    }, true, 'human_resource.annual_leave');
}