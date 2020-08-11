import {LOCAL_SERVER_API} from '../../../../env';
import {sendRequest} from '../../../../helpers/requestHelper';

export const MaintainanceService = {
    createMaintainance,
    updateMaintainance,
    deleteMaintainance,
}

// tạo mới thông tin bảo trì tài sản
function createMaintainance(id, data, incident_id) {
    return sendRequest({
        url: incident_id ? `${LOCAL_SERVER_API}/assets/assets/${id}/maintainance-logs?incident_id=${incident_id}` : `${LOCAL_SERVER_API}/assets/assets/${id}/maintainance-logs`,
        method: 'POST',
        data: data
    }, true, true, 'asset.maintainance');
}

// chỉnh sửa thông tin bảo trì tài sản
function updateMaintainance(assetId, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/assets/${assetId}/maintainance-logs`,
        method: 'PATCH',
        data
    }, true, true, 'asset.maintainance');
}

// xóa thông tin bảo trì tài sản
function deleteMaintainance(assetId, maintainanceId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/assets/${assetId}/maintainance-logs`,
        method: 'DELETE',
        data: {maintainanceId}
    }, true, true, 'asset.maintainance');
}
