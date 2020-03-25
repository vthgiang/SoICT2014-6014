import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const SalaryService = {
    getListSalary,
    createNewSalary,
    deleteSalary,
    updateSalary,
    checkSalary,
    checkArraySalary,
    importSalary
}

// Lấy danh sách bảng lương
function getListSalary(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/salary/paginate`, requestOptions).then(handleResponse);

}

// tạo mới một bảng lương
function createNewSalary(data) {
    const requestOptions ={
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/salary/create`, requestOptions).then(handleResponse);
}

// Xoá bảng lương  theo mã nhân viên và tháng lương
function deleteSalary(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/salary/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin bảng lương theo mã nhân viên và tháng lương
function updateSalary(id,data) {
    const requestOptions ={
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/salary/${id}`, requestOptions).then(handleResponse);
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương 
function checkSalary(employeeNumber,month) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    }

    return fetch(`${ LOCAL_SERVER_API }/salary/checkSalary/${employeeNumber}/${month}`, requestOptions).then(handleResponse);
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array
function checkArraySalary(arraySalary) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(arraySalary)
    }

    return fetch(`${ LOCAL_SERVER_API }/salary/checkArraySalary`, requestOptions).then(handleResponse);
}

// Import lương nhân viên
function importSalary(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    }

    return fetch(`${ LOCAL_SERVER_API }/salary/import`, requestOptions).then(handleResponse);
}