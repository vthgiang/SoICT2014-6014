import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const AssetTypeService = {
    searchAssetTypes,
    getAssetTypes,
    createAssetTypes,
    editAssetType,
    deleteAssetTypes,
    deleteManyAssetType,
}

// Lấy danh sách loại tài sản
function searchAssetTypes(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/asset-types`,
        method: 'GET',
        params: {
            typeNumber: data.typeNumber,
            typeName: data.typeName,
            page: data.page,
            limit: data.limit,
        }
    }, false, true, 'asset.asset_type');
}

// Danh mục văn bản - domain
function getAssetTypes() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/asset-types`,
        method: 'GET',
    }, false, true, 'asset.asset_type');
}

function createAssetTypes(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/asset-types`,
        method: 'POST',
        data,
    }, true, true, 'asset.asset_type');
}

function editAssetType(id, data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/asset-types/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'asset.asset_type');
}

function deleteAssetTypes(id) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/asset-types/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.asset_type');
}

function deleteManyAssetType(array) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assettype/types/asset-delete-many`,
        method: 'DELETE',
        data: {array}
    }, true, true, 'asset.asset_type');
}