import {
    handleResponse
} from '../../../../helpers/HandleResponse';
export const EmployeeService = {
    addNewEmployee,
    getByEmployeeNumber,
    updateInformationEmpoyee,
    uploadAvatar,
    updateContract,
    updateCertificate,
    updateCertificateShort,
    updateFile,
}

// lấy thông tin nhân viên theo id
function getByEmployeeNumber(id) {
    const requestOptions = {
        method: 'GET',
    }
    return fetch(`/employee/${id}`, requestOptions).then(handleResponse);
}

// Thêm mới thông tin nhân viên
function addNewEmployee(newEmployee) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
    };

    return fetch(`/employee`, requestOptions).then(handleResponse)

}

// Cập nhật thông tin nhân viên
function updateInformationEmpoyee(id, information) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(information)
    };
    return fetch(`employee/${id}`, requestOptions).then(handleResponse)
}

// upload ảnh đại diện của nhân viên
function uploadAvatar(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        body: fileUpload
    };
    return fetch(`/employee/avatar/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin hợp đồng lao động
function updateContract(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        body: fileUpload
    };
    return fetch(`/employee/contract/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin bằng cấp
function updateCertificate(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        body: fileUpload
    };
    return fetch(`/employee/certificate/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin chứng chỉ
function updateCertificateShort(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        body: fileUpload
    };
    return fetch(`/employee/certificateShort/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin tài liệu đính kèm
function updateFile(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        body: fileUpload
    };
    return fetch(`/employee/file/${employeeNumber}`, requestOptions).then(handleResponse);

}
