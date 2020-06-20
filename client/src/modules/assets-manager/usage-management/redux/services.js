import {LOCAL_SERVER_API} from '../../../../env';
import {sendRequest} from '../../../../helpers/requestHelper';

export const UsageService = {
    createUsage,
    updateUsage,
    deleteUsage,
}

// tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createUsage(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/createUsage/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.usage');
}

// chỉnh sửa thông tin sử dụng tài sản
function updateUsage(assetId, usageId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/updateUsage/${assetId}`,
        method: 'PUT',
        data: {usageId}
    }, true, true, 'asset.usage');
}

// xóa thông tin sử dụng tài sản
function deleteUsage(assetId, usageId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/deleteUsage/${assetId}`,
        method: 'DELETE',
        data: {usageId}
    }, true, true, 'asset.usage');
}
