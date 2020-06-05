import axios from 'axios';
import {
    handleResponse
} from '../../../../helpers/handleResponse';
import { LOCAL_SERVER_API } from '../../../../env';
import {
    AuthenticateHeader,
    AuthenticateHeaderPATCH
} from '../../../../config';
export const AssetService = {
    getAll,
    addNewAsset,
    updateInformationAsset,
    uploadAvatar,
    updateFile,
    checkCode,
    deleteAsset,
}

// Lấy danh sách tài sản
function getAll(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    }
    return fetch(`${ LOCAL_SERVER_API }/asset/paginate`, requestOptions).then(handleResponse);
}

// Kiểm tra sự tồn tại của Code
function checkCode(code) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    }

    return fetch(`${ LOCAL_SERVER_API }/asset/checkCode/${code}`, requestOptions).then(handleResponse);
}

// Thêm mới thông tin tài sản
function addNewAsset(newAsset) {
    const requestOptions = {
        url:`${ LOCAL_SERVER_API }/asset`,
        method: 'POST',
        headers: AuthenticateHeader(),
        body: newAsset
    };

    return axios(requestOptions)

}

// Cập nhật thông tin tài sản theo id
function updateInformationAsset(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${ LOCAL_SERVER_API }/asset/update/${id}`, requestOptions).then(handleResponse);
}

// upload ảnh của tài sản
function uploadAvatar(code, fileUpload) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/asset/avatar/${code}`,
        method: 'PATCH',
        data: fileUpload,
        headers: AuthenticateHeaderPATCH()
    };
    return axios(requestOptions);

}


// Cập nhật (thêm) thông tin tài liệu đính kèm
function updateFile(code, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/asset/file/${code}`, requestOptions).then(handleResponse);

}

// Xoá thông tin tài sản
function deleteAsset(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/asset/${id}`, requestOptions).then(handleResponse);
}
