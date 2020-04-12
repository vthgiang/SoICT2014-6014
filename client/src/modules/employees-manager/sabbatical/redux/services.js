import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const SabbaticalService = {
    getListSabbatical,
    createNewSabbatical,
    deleteSabbatical,
    updateSabbatical,
}

// Lấy danh sách nghỉ phép
function getListSabbatical(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/sabbatical/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// tạo mới thông tin nghỉ phép
function createNewSabbatical(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/sabbatical/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin nghỉ phép
function deleteSabbatical(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/sabbatical/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin nghỉ phép
function updateSabbatical(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/sabbatical/${id}`,
        method: 'PUT',
        data:data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}