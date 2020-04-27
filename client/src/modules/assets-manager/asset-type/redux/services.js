import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';
export const AssetTypeService = {
    searchAssetTypes,
    createAssetType,
    deleteAssetType,
    updateAssetType,
}

// Lấy danh sách nghỉ phép
function searchAssetTypes(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/assettype/paginate`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// tạo mới thông tin nghỉ phép
function createAssetType(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/assettype/create`,
        method: 'POST',
        data: data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Xoá thông tin nghỉ phép
function deleteAssetType(id) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/assettype/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}

// Cập nhật thông tin nghỉ phép
function updateAssetType(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/assettype/${id}`,
        method: 'PUT',
        data:data,
        headers: AuthenticateHeader()
    };
    return axios(requestOptions);
}