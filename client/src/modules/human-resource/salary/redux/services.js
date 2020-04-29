import { LOCAL_SERVER_API } from '../../../../env';
import {
    sendRequest
} from '../../../../helpers/requestHelper';
export const SalaryService = {
    searchSalary,
    createSalary,
    deleteSalary,
    updateSalary,
    checkSalary,
    checkArraySalary,
    importSalary
}

/**
 * Lấy danh sách bảng lương
 * @data dữ liệu key tìm kiếm
 */ 
function searchSalary(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salary/paginate`,
        method: 'POST',
        data: data
    }, false, 'human_resource.salary');
}

/**
 * Tạo mới một bảng lương
 * @data dữ liệu bảng lương mới
 */
function createSalary(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salary/create`,
        method: 'POST',
        data: data,
    }, true, 'human_resource.salary');
}

/**
 * Xoá bảng lương  theo id
 * @id Id bảng lương cần xoá
 */
function deleteSalary(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salary/${id}`,
        method: 'DELETE',
    }, true, 'human_resource.salary');
}

/**
 * Cập nhật thông tin bảng lương
 * @id : Id bảng lương cần cập nhật
 * @data : Dữ liệu cập nhật bảng lương 
 */
function updateSalary(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salary/${id}`,
        method: 'PUT',
        data: data,
    }, true, 'human_resource.salary');
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương 
function checkSalary(employeeNumber, month) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salary/checkSalary/${employeeNumber}/${month}`,
        method: 'GET',
    }, false, 'human_resource.salary');
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array
function checkArraySalary(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salary/checkArraySalary`,
        method: 'POST',
        data: data,
    }, false, 'human_resource.salary');
}

// Import lương nhân viên
function importSalary(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salary/import`,
        method: 'POST',
        data: data,
    }, false, 'human_resource.salary');
}