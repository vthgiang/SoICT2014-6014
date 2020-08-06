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
        url: `${LOCAL_SERVER_API}/assets/assets/${id}/usage-logs`,
        method: 'POST',
        data: data
    }, true, true, 'asset.usage');
}

// chỉnh sửa thông tin sử dụng tài sản
function updateUsage(assetId, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/assets/${assetId}/usage-logs`,
        method: 'PATCH',
        data
    }, true, true, 'asset.usage');
}

// xóa thông tin sử dụng tài sản
function deleteUsage(assetId, usageId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/assets/${assetId}/usage-logs`,
        method: 'DELETE',
        data: {usageId}
    }, true, true, 'asset.usage');
}
