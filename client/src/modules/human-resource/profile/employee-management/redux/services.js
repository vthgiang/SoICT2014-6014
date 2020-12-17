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
        url: `${ process.env.REACT_APP_SERVER }/employee/employees`,
        method: 'GET',
        params: data?.searchForPackage ? data : {
            exportData: data ? data.exportData : data,
            arrEmail: data ? data.arrEmail : data,
            startDate: data ? data.startDate : data,
            endDate: data ? data.endDate : data,
            professionalSkills: data ? data.professionalSkills : data,
            careerFields: data? data.careerFields: data,
            organizationalUnits: data ? data.organizationalUnits : data,
            position: data ? data.position : data,
            employeeName: data? data.employeeName : data,
            employeeNumber: data ? data.employeeNumber : data,
            gender: data ? data.gender : data,
            status: data ? data.status : data,
            endDateOfContract: data ? data.endDateOfContract : data,
            birthdate: data ? data.birthdate : data,
            typeOfContract: data ? data.typeOfContract : data,
            page: data ? data.page : data,
            limit: data ? data.limit : data
        }
    }, false, true, 'human_resource.profile.employee_management');
}

/**
 * Lấy danh sách nhân viên
 * @param {*} data : dữ liệu key tìm kiếm
 */
function searchForPackage(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employee/employees`,
        method: 'GET',
        params: data,
    }, false, true, 'human_resource.profile.employee_management');
}

/**
 * Thêm mới thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần tạo
 */
function addNewEmployee(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employee/employees`,
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
        url: `${ process.env.REACT_APP_SERVER }/employee/employees/${id}`,
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
        url: `${ process.env.REACT_APP_SERVER }/employee/employees/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.profile.employee_management');
}

/**
 * Import thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần import
 */
function importEmployees(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/employee/employees/import`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.profile.employee_management');
}