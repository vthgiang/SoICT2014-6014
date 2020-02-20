import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import {
    TOKEN_SECRET
} from '../../../../env';
import {
    AuthenticateHeader,
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';

export const EmployeeService = {
    addNewEmployee,
    getInformationPersonal,
    updateInformationPersonal,
    uploadAvatar,
    updateContract,
    updateCertificate,
    updateCertificateShort,
    updateFile,
}

// lấy thông tin nhân viên theo id
async function getInformationPersonal(){
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var email = verified.email;
    const requestOptions = {
        method: 'GET',
    }
    return fetch(`/employee/${email}`, requestOptions).then(handleResponse);
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

// Cập nhật thông tin cá nhân
async function updateInformationPersonal(information) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var email = verified.email;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(information)
    };
    return fetch(`employee/${email}`, requestOptions).then(handleResponse);
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
