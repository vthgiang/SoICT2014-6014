import { LOCAL_SERVER_API} from '../../../../../env';
import {sendRequest} from '../../../../../helpers/requestHelper';

export const EmployeeService = {
    getAll,
    addNewEmployee,
    updateInformationEmployee,
    deleteEmployee,
}
/**
 * Lấy danh sách nhân viên
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAll(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees`,
        method: 'GET',
        params: {
            organizationalUnit: data.organizationalUnit,
            position: data.position,
            employeeNumber: data.employeeNumber,
            gender: data.gender,
            status: data.status,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.profile.employee_management');
}

/**
 * Thêm mới thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần tạo
 */
function addNewEmployee(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.profile.employee_management');
}

/**
 * Cập nhật thông tin nhân viên theo id
 * @param {*} id 
 * @param {*} data 
 */
function updateInformationEmployee(id, data) {
    console.log(data);
    console.log(id);
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/${id}`,
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













