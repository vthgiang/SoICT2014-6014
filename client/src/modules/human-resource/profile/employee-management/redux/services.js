import axios from 'axios';
import {
    handleResponse
} from '../../../../../helpers/handleResponse';
import { LOCAL_SERVER_API } from '../../../../../env';
import {
    AuthenticateHeader,
    AuthenticateHeaderPATCH
} from '../../../../../config';
export const EmployeeService = {
    getAll,
    addNewEmployee,
    updateInformationEmployee,
    uploadAvatar,
    updateContract,
    updateCertificate,
    updateCertificateShort,
    updateFile,
    checkMSNV,
    checkEmail,
    deleteEmployee,
    checkArrayMSNV,

}

// Lấy danh sách nhân viên
function getAll(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    }

    return fetch(`${ LOCAL_SERVER_API }/employee/paginate`, requestOptions).then(handleResponse);
}

// Kiểm tra sự tồn tại của MSNV 
function checkMSNV(employeeNumber) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    }

    return fetch(`${ LOCAL_SERVER_API }/employee/checkMSNV/${employeeNumber}`, requestOptions).then(handleResponse);
}

// Kiểm tra sự tồn tại của email
function checkEmail(email) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    }

    return fetch(`${ LOCAL_SERVER_API }/employee/checkEmail/${email}`, requestOptions).then(handleResponse);
}

// Thêm mới thông tin nhân viên
function addNewEmployee(newEmployee) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newEmployee)
    };

    return fetch(`${ LOCAL_SERVER_API }/employee`, requestOptions).then(handleResponse)

}

// Cập nhật thông tin nhân viên theo id
function updateInformationEmployee(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/employee/update/${id}`, requestOptions).then(handleResponse);
}



// upload ảnh đại diện của nhân viên
function uploadAvatar(employeeNumber, fileUpload) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/employee/avatar/${employeeNumber}`,
        method: 'PATCH',
        data: fileUpload,
        headers: AuthenticateHeaderPATCH()
    };
    return axios(requestOptions);
    // const requestOptions = {
    //     method: 'PATCH',
    //     headers: AuthenticateHeaderPATCH(),
    //     body: fileUpload,

    // };
    // return fetch(`${ LOCAL_SERVER_API }/employee/avatar/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin hợp đồng lao động
function updateContract(employeeNumber, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/employee/contract/${employeeNumber}`, requestOptions).then(handleResponse);
}

// Cập nhật (thêm) thông tin bằng cấp
function updateCertificate(employeeNumber, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/employee/certificate/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin chứng chỉ
function updateCertificateShort(employeeNumber, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/employee/certificateShort/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin tài liệu đính kèm
function updateFile(employeeNumber, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/employee/file/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Xoá thông tin nhân viên
function deleteEmployee(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/employee/${id}`, requestOptions).then(handleResponse);
}

// Kiểm tra sự tồn tại của MSNV trong array 
function checkArrayMSNV(arrayMSNV) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(arrayMSNV)
    }

    return fetch(`${ LOCAL_SERVER_API }/employee/checkArrayMSNV`, requestOptions).then(handleResponse);
}