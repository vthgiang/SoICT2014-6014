import { sendRequest } from '../../../../../helpers/requestHelper'

export const transportPlanServices = {
  getAllTransportPlans,
  createTransportPlan,
  getDetailTransportPlan,
  getDetailTransportPlan2,
  editTransportPlan,
  addTransportRequirementToPlan,
  addTransportVehicleToPlan,
  deleteTransportPlan
}

function getAllTransportPlans(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-plan`,
      method: 'GET',
      params: {
        // page: queryData !== undefined ? queryData.page : null,
        // limit: queryData !== undefined ? queryData.limit : null
        page: queryData !== undefined ? queryData.page : null,
        limit: queryData !== undefined ? queryData.limit : null,
        currentUserId: localStorage.getItem('userId'),
        currentRole: localStorage.getItem('currentRole'),
        searchData: queryData?.searchData
      }
    },
    false, // Nếu có truy vấn thành công thì không hiện thông báo
    true, // Nếu có truy vấn thất bại thì hiện thông báo
    'manage_transport.transportPlan'
  )
}

function createTransportPlan(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-plan`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_transport.transportPlan'
  )
}

function getDetailTransportPlan(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-plan/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_transport.transportPlan'
  )
}

function getDetailTransportPlan2(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-plan/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_transport.transportPlan'
  )
}

function editTransportPlan(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-plan/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_transport.transportPlan'
  )
}

function addTransportRequirementToPlan(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-plan/add-transport-requirement/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_transport.transportPlan'
  )
}

function addTransportVehicleToPlan(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-plan/add-transport-vehicle/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_transport.transportPlan'
  )
}

function deleteTransportPlan(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-plan/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'manage_transport.transportPlan'
  )
}
