import axios from 'axios';
import {
    handleResponse
} from '../../../../../helpers/handleResponse';
import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    sendRequest
} from '../../../../../helpers/requestHelper';
import {
    AuthenticateHeader,
    AuthenticateHeaderPATCH
} from '../../../../../config';
export const EmployeeService = {
    getAll,
    addNewEmployee,
    updateInformationEmployee,
    deleteEmployee,
}

// Lấy danh sách nhân viên
function getAll(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/paginate`,
        method: 'POST',
        data: data,
    }, false, true, 'human_resource.profile.employee_management');
}

// Thêm mới thông tin nhân viên
function addNewEmployee(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.profile.employee_management');
}

// Cập nhật thông tin nhân viên theo id
function updateInformationEmployee(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }}/employees/update/${id}`,
        method: 'PUT',
        data: data,
    }, true, true, 'human_resource.profile.employee_management');
}

/**
 * Xoá thông tin nhân viên
 * @id : id thông tin nhân viên cần xoá
 */
function deleteEmployee(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.profile.employee_management');
}













