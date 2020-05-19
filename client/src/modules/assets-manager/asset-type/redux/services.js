import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const AssetTypeService = {
    searchAssetTypes,
    createAssetType,
    deleteAssetType,
    updateAssetType,
}

// Lấy danh sách loại tài sản
function searchAssetTypes(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/paginate`,
        method: 'POST',
        data: data
    }, false, true, 'asset.asset_type');
}

// tạo mới thông tin nghỉ phép
function createAssetType(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/create`,
        method: 'POST',
        data: data
    }, true, true, 'asset.asset_type');
}

// Xoá thông tin nghỉ phép
function deleteAssetType(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.asset_type');
}

// Cập nhật thông tin nghỉ phép
function updateAssetType(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.asset_type');
}