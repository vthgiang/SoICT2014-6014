import {
    sendRequest
} from '../../../../../helpers/requestHelper';

export const EmployeeService = {
    getAll,
    addNewEmployee,
    updateInformationEmployee,
    deleteEmployee,
    importEmployees,
}
/**
 * Lấy danh sách nhân viên
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAll(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employees`,
        method: 'GET',
        params: {
            numberMonth: data !== undefined ? data.numberMonth : data,
            organizationalUnits: data !== undefined ? data.organizationalUnits : data,
            position: data !== undefined ? data.position : data,
            employeeNumber: data !== undefined ? data.employeeNumber : data,
            gender: data !== undefined ? data.gender : data,
            status: data !== undefined ? data.status : data,
            endDateOfContract: data !== undefined ? data.endDateOfContract : data,
            birthdate: data !== undefined ? data.birthdate : data,
            typeOfContract: data !== undefined ? data.typeOfContract : data,
            page: data !== undefined ? data.page : data,
            limit: data !== undefined ? data.limit : data
        }
    }, false, true, 'human_resource.profile.employee_management');
}

/**
 * Thêm mới thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần tạo
 */
function addNewEmployee(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employees`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.profile.employee_management');
}

/**
 * Cập nhật thông tin nhân viên theo id
 * @param {*} id : id thông tin nhân viên cần chỉnh sửa
 * @param {*} data :dữ liệu chỉnh sửa thông tin nhân viên
 */
function updateInformationEmployee(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employees/${id}`,
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
        url: `${ process.env.REACT_APP_SERVER }/employees/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.profile.employee_management');
}

/**
 * Import thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần import
 */
function importEmployees(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employees/import`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.profile.employee_management');
}