import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const AnnualLeaveService = {
    searchAnnualLeaves,
    createAnnualLeave,
    deleteAnnualLeave,
    updateAnnualLeave,
}

// Lấy danh sách nghỉ phép
function searchAnnualLeaves(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/sabbatical/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// tạo mới thông tin nghỉ phép
function createAnnualLeave(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/sabbatical/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin nghỉ phép
function deleteAnnualLeave(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/sabbatical/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin nghỉ phép
function updateAnnualLeave(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/sabbatical/${id}`,
        method: 'PUT',
        data:data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}