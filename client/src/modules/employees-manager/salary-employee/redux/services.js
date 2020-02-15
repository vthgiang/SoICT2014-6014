import {
    handleResponse
} from '../../../../helpers/HandleResponse';
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/salary/paginate`, requestOptions).then(handleResponse);

}

// tạo mới một bảng lương
function createNewSalary(data) {
    const requestOptions ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(`/salary/create`, requestOptions).then(handleResponse);
}

// Xoá bảng lương  theo mã nhân viên và tháng lương
function deleteSalary(employeeNumber,month) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/salary/${employeeNumber}/${month}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin bảng lương theo mã nhân viên và tháng lương
function updateSalary(employeeNumber,month, data) {
    const requestOptions ={
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    return fetch(`/salary/${employeeNumber}/${month}`, requestOptions).then(handleResponse);
}