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
        url: `${ LOCAL_SERVER_API }/annualLeaves`,
        method: 'GET',
        params: {
            organizationalUnits: data.organizationalUnits,
            position: data.position,
            employeeNumber: data.employeeNumber,
            month: data.month,
            page: data.page,
            status: data.status,
            limit: data.limit
        }
    }, false, true, 'human_resource.annual_leave');
}

/**
 * Tạo mới thông tin nghỉ phép
 * @data : Dữ liệu tạo mới thông tin nghỉ phép
 */
function createAnnualLeave(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/annualLeaves`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.annual_leave');
}

/**
 * Xoá thông tin nghỉ phép
 * @id: Id nghỉ phép cần xoá
 */
function deleteAnnualLeave(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/annualLeaves/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.annual_leave');
}
/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép cần cập nhật 
 * @data  : dữ liệu cập nhật nghỉ phép
 */
function updateAnnualLeave(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/annualLeaves/${id}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.annual_leave');
}