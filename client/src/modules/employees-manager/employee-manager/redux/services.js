import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import {
    AuthenticateHeader,
    AuthenticateHeaderPATCH
} from '../../../../config';
export const EmployeeService = {
    getAll,
    addNewEmployee,
    uploadAvatar,
    updateContract,
    updateCertificate,
    updateCertificateShort,
    updateFile,

}

// Lấy danh sách nhân viên
function getAll(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    }

    return fetch(`/employee/paginate`, requestOptions).then(handleResponse);
}

// Thêm mới thông tin nhân viên
function addNewEmployee(newEmployee) {
    const requestOptions = {
        method: 'POST',
        headers:AuthenticateHeader(),
        body: JSON.stringify(newEmployee)
    };

    return fetch(`/employee`, requestOptions).then(handleResponse)

}

// upload ảnh đại diện của nhân viên
function uploadAvatar(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        headers:AuthenticateHeaderPATCH(),
        body: fileUpload,

    };
    return fetch(`/employee/avatar/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin hợp đồng lao động
function updateContract(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        headers:AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`/employee/contract/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin bằng cấp
function updateCertificate(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        headers:AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`/employee/certificate/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin chứng chỉ
function updateCertificateShort(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        headers:AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`/employee/certificateShort/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin tài liệu đính kèm
function updateFile(employeeNumber,fileUpload){
    const requestOptions = {
        method: 'PATCH',
        headers:AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`/employee/file/${employeeNumber}`, requestOptions).then(handleResponse);

}