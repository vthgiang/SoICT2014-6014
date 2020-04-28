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
    checkAssetNumber,
    deleteAsset,
    checkArrayAssetNumber,

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

// Kiểm tra sự tồn tại của AssetNumber
function checkAssetNumber(assetNumber) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    }

    return fetch(`${ LOCAL_SERVER_API }/asset/checkAssetNumber/${assetNumber}`, requestOptions).then(handleResponse);
}

// Thêm mới thông tin tài sản
function addNewAsset(newAsset) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newAsset)
    };

    return fetch(`${ LOCAL_SERVER_API }/asset`, requestOptions).then(handleResponse)

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
function uploadAvatar(assetNumber, fileUpload) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/asset/avatar/${assetNumber}`,
        method: 'PATCH',
        data: fileUpload,
        headers: AuthenticateHeaderPATCH()
    };
    return axios(requestOptions);

}


// Cập nhật (thêm) thông tin tài liệu đính kèm
function updateFile(assetNumber, fileUpload) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeaderPATCH(),
        body: fileUpload
    };
    return fetch(`${ LOCAL_SERVER_API }/asset/file/${assetNumber}`, requestOptions).then(handleResponse);

}

// Xoá thông tin tài sản
function deleteAsset(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader(),
    };

    return fetch(`${ LOCAL_SERVER_API }/asset/${id}`, requestOptions).then(handleResponse);
}

// Kiểm tra sự tồn tại của AssetNumber trong array 
function checkArrayAssetNumber(arrayAssetNumber) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(arrayAssetNumber)
    }

    return fetch(`${ LOCAL_SERVER_API }/asset/checkArrayAssetNumber`, requestOptions).then(handleResponse);
}