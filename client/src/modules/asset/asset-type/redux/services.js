import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const AssetTypeService = {
    searchAssetTypes,
    createAssetType,
    deleteAssetType,
    updateAssetType,

    getAssetTypes,
    createAssetTypes,
    editAssetType,
    deleteAssetTypes,
    deleteManyAssetType,
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

// Danh mục văn bản - domain
function getAssetTypes() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/types`,
        method: 'GET',
    }, false, true, 'asset.asset_type');
}

function createAssetTypes(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/types`,
        method: 'POST',
        data,
    }, true, true, 'asset.asset_type');
}

function editAssetType(id, data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/types/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'asset.asset_type');
}

function deleteAssetTypes(id) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/types/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.asset_type');
}

function deleteManyAssetType(array) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/types/delete-many`,
        method: 'POST',
        data: {array}
    }, true, true, 'asset.asset_type');
}