import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
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
        url: `${ LOCAL_SERVER_API }/salaries`,
        method: 'GET',
        params: {
            organizationalUnit: data.organizationalUnit,
            position: data.position,
            employeeNumber: data.employeeNumber,
            month: data.month,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.salary');
}

/**
 * Tạo mới một bảng lương
 * @data dữ liệu bảng lương mới
 */
function createSalary(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salaries`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.salary');
}

/**
 * Xoá bảng lương  theo id
 * @id Id bảng lương cần xoá
 */
function deleteSalary(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salaries/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.salary');
}

/**
 * Cập nhật thông tin bảng lương
 * @id : Id bảng lương cần cập nhật
 * @data : Dữ liệu cập nhật bảng lương 
 */
function updateSalary(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salaries/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.salary');
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương 
function checkSalary(employeeNumber, month) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salaries/checkSalary/${employeeNumber}/${month}`,
        method: 'GET',
    }, false, true, 'human_resource.salary');
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array
function checkArraySalary(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salaries/checkArraySalary`,
        method: 'POST',
        data: data,
    }, false, true, 'human_resource.salary');
}

// Import lương nhân viên
function importSalary(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/salaries/import`,
        method: 'POST',
        data: data,
    }, false, true, 'human_resource.salary');
}