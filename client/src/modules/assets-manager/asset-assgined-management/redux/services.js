import {LOCAL_SERVER_API} from '../../../../env';
import {sendRequest} from '../../../../helpers/requestHelper';

export const IncidentService = {
    createIncident,
    updateIncident,
    deleteIncident,
}

// tạo mới thông tin sự cố tài sản
function createIncident(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/createIncident/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'asset.incident');
}

// chỉnh sửa thông tin sự cố tài sản
function updateIncident(assetId, incidentId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/updateIncident/${assetId}`,
        method: 'PUT',
        data: {incidentId}
    }, true, true, 'asset.incident');
}

// xóa thông tin sự cố tài sản
function deleteIncident(assetId, incidentId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/assets/deleteIncident/${assetId}`,
        method: 'DELETE',
        data: {incidentId}
    }, true, true, 'asset.incident');
}
