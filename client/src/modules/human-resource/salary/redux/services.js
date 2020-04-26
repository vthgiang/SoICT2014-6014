import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const SalaryService = {
    searchSalary,
    createSalary,
    deleteSalary,
    updateSalary,
    checkSalary,
    checkArraySalary,
    importSalary
}

// Lấy danh sách bảng lương
function searchSalary(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/salary/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// tạo mới một bảng lương
function createSalary(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/salary/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá bảng lương  theo id
function deleteSalary(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/salary/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin bảng lương theo id
function updateSalary(id,data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/salary/${id}`,
        method: 'PUT',
        data:data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương 
function checkSalary(employeeNumber,month) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/salary/checkSalary/${employeeNumber}/${month}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array
function checkArraySalary(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/salary/checkArraySalary`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Import lương nhân viên
function importSalary(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/salary/import`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}