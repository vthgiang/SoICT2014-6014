import { sendRequest } from '../../../../../helpers/requestHelper'

export const IncidentService = {
  getIncidents,
  createIncident,
  createMaintainanceForIncident,
  updateIncident,
  deleteIncident
}

// Lấy danh sách sự cố
function getIncidents(data) {
  const params = {
    code: data ? data.code : data,
    assetName: data ? data.assetName : data,
    incidentCode: data ? data.incidentCode : data,
    incidentType: data ? data.incidentType : data,
    incidentStatus: data ? data.incidentStatus : data,
    page: data ? data.page : data,
    limit: data ? data.limit : data,
    managedBy: data ? data.managedBy : data,
    dataType: data?.dataType
  }

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/asset/assets/incident-logs`,
      method: 'GET',
      params
    },
    false,
    true,
    'asset.incident'
  )
}

// tạo mới thông tin sự cố tài sản
function createIncident(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}/incident-logs`,
      method: 'POST',
      data
    },
    true,
    true,
    'asset.incident'
  )
}

// tạo mới thông tin bảo trì tài sản
function createMaintainanceForIncident(assetId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/maintainance-logs`,
      method: 'POST',
      data
    },
    true,
    true,
    'asset.maintainance'
  )
}

// chỉnh sửa thông tin sự cố tài sản
function updateIncident(assetId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/asset/assets/${assetId}/incident-logs`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'asset.incident'
  )
}

// xóa thông tin sự cố tài sản

function deleteIncident(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/asset/assets/incident-log`,
      method: 'DELETE',
      data: {
        incidentIds: data?.incidentIds
      }
    },
    true,
    true,
    'asset.incident'
  )
}
