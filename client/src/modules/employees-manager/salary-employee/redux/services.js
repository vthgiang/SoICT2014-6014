import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import { AuthenticateHeader } from '../../../../config';
export const SalaryService = {
    getListSalary,
    createNewSalary,
    deleteSalary,
    updateSalary,
}

// Lấy danh sách bảng lương
function getListSalary(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`/salary/paginate`, requestOptions).then(handleResponse);

}

// tạo mới một bảng lương
function createNewSalary(data) {
    const requestOptions ={
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`/salary/create`, requestOptions).then(handleResponse);
}

// Xoá bảng lương  theo mã nhân viên và tháng lương
function deleteSalary(id) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/salary/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin bảng lương theo mã nhân viên và tháng lương
function updateSalary(id,data) {
    const requestOptions ={
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`/salary/${id}`, requestOptions).then(handleResponse);
}