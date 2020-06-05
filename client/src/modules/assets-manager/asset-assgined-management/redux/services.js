import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const AssetCrashService = {
    searchAssetCrashs,
    createAssetCrash,
    deleteAssetCrash,
    updateAssetCrash,
}

/**
 * Lấy danh sách báo cáo sự cố thiết bị
 */
function searchAssetCrashs(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assetcrash/paginate`,
        method: 'POST',
        data: data
    }, false, true, 'asset.asset_crash');
}

/**
 * Tạo mới thông tin báo cáo sự cố thiết bị
 */
function createAssetCrash(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assetcrash/create`,
        method: 'POST',
        data: data
    }, true, true, 'asset.asset_crash');
}

/**
 * Xóa thông tin báo cáo sự cố thiết bị
 */
function deleteAssetCrash(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assetcrash/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.asset_crash');
}

/**
 * Cập nhật thông tin báo cáo sự cố thiết bị
 */
function updateAssetCrash(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/assetcrash/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.asset_crash');
}