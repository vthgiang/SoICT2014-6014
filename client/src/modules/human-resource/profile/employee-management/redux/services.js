import axios from 'axios';
import {
    handleResponse
} from '../../../../../helpers/handleResponse';
import {
    LOCAL_SERVER_API
} from '../../../../../env';
import {
    sendRequest
} from '../../../../../helpers/requestHelper';
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
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/paginate`,
        method: 'POST',
        data: data,
    }, false, true, 'human_resource.profile.employee_management');
}

// Kiểm tra sự tồn tại của MSNV 
function checkMSNV(employeeNumber) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    }

    return fetch(`${ LOCAL_SERVER_API }/employees/checkMSNV/${employeeNumber}`, requestOptions).then(handleResponse);
}

// Kiểm tra sự tồn tại của email
function checkEmail(email) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    }

    return fetch(`${ LOCAL_SERVER_API }/employees/checkEmail/${email}`, requestOptions).then(handleResponse);
}

// Thêm mới thông tin nhân viên
function addNewEmployee(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.profile.employee_management');
}

// Cập nhật thông tin nhân viên theo id
function updateInformationEmployee(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/employees/update/${id}`, requestOptions).then(handleResponse);
}

/**
 * Xoá thông tin nhân viên
 * @id : id thông tin nhân viên cần xoá
 */
function deleteEmployee(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/employees/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.profile.employee_management');
}



// upload ảnh đại diện của nhân viên
function uploadAvatar(employeeNumber, fileUpload) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/employees/avatar/${employeeNumber}`,
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
    return fetch(`${ LOCAL_SERVER_API }/employees/contract/${employeeNumber}`, requestOptions).then(handleResponse);
}

// Cập nhật (thêm) thông tin bằng cấp
function updateCertificate(employeeNumber, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/employees/certificate/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin chứng chỉ
function updateCertificateShort(employeeNumber, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/employees/certificateShort/${employeeNumber}`, requestOptions).then(handleResponse);

}

// Cập nhật (thêm) thông tin tài liệu đính kèm
function updateFile(employeeNumber, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/employees/file/${employeeNumber}`, requestOptions).then(handleResponse);

}



// Kiểm tra sự tồn tại của MSNV trong array 
function checkArrayMSNV(arrayMSNV) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(arrayMSNV)
    }

    return fetch(`${ LOCAL_SERVER_API }/employees/checkArrayMSNV`, requestOptions).then(handleResponse);
}