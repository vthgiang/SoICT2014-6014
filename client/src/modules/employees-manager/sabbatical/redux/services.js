import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import { LOCAL_SERVER_API } from '../../../../env';
import {
    AuthenticateHeader
} from '../../../../config';
export const SabbaticalService = {
    getListSabbatical,
    createNewSabbatical,
    deleteSabbatical,
    updateSabbatical,
}

// Lấy danh sách nghỉ phép
function getListSabbatical(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/sabbatical/paginate`, requestOptions).then(handleResponse);

}

// tạo mới thông tin nghỉ phép
function createNewSabbatical(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`${ LOCAL_SERVER_API }/sabbatical/create`, requestOptions).then(handleResponse);
}

// Xoá thông tin nghỉ phép
function deleteSabbatical(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/sabbatical/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin nghỉ phép
function updateSabbatical(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/sabbatical/${id}`, requestOptions).then(handleResponse);
}