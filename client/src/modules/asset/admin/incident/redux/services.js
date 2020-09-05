import {sendRequest} from '../../../../../helpers/requestHelper';

export const IncidentService = {
    createIncident,
    createMaintainanceForIncident,
    updateIncident,
    deleteIncident,
}

// tạo mới thông tin sự cố tài sản
function createIncident(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}/incident-logs`,
        method: 'POST',
        data: data
    }, true, true, 'asset.incident');
}

// tạo mới thông tin bảo trì tài sản
function createMaintainanceForIncident(assetId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/maintainance-logs`,
        method: 'POST',
        data
    }, true, true, 'asset.maintainance');
}

// chỉnh sửa thông tin sự cố tài sản
function updateIncident(assetId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/incident-logs`,
        method: 'PATCH',
        data:data
    }, true, true, 'asset.incident');
}

// xóa thông tin sự cố tài sản
function deleteIncident(assetId, incidentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/incident-logs`,
        method: 'DELETE',
        data: {incidentId}
    }, true, true, 'asset.incident');
}
