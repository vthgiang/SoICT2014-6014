import {sendRequest} from '../../../../helpers/requestHelper';

export const UsageService = {
    createUsage,
    updateUsage,
    deleteUsage,
    recallAsset,
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createUsage(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/assets/assets/${id}/usage-logs`,
        method: 'POST',
        data: data
    }, true, true, 'asset.usage');
}

// Chỉnh sửa thông tin sử dụng tài sản
function updateUsage(assetId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/assets/assets/${assetId}/usage-logs`,
        method: 'PATCH',
        data: data,
    }, true, true, 'asset.usage');
}

// Xóa thông tin sử dụng tài sản
function deleteUsage(assetId, usageId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/assets/assets/${assetId}/usage-logs`,
        method: 'DELETE',
        data: { usageId }
    }, true, true, 'asset.usage');
}

function recallAsset(assetId, data){
    console.log("Services", assetId, data);
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/assets/${assetId}/usage-logs`,
        method: 'PATCH',
        data: data,
        params: {
            recallAsset: true,
        }
    }, true, true, 'asset.usage');
}