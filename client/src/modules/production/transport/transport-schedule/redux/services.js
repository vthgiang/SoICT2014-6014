import { sendRequest } from '../../../../../helpers/requestHelper'
export const transportScheduleServices = {
  editTransportScheduleByPlanId,
  getTransportScheduleByPlanId,
  changeTransportRequirementProcess,
  getTransportScheduleByCarrierId,
  driverSendMessage,
  changeTransportStatusByCarrierId
}

function getTransportScheduleByPlanId(planId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-schedule/get-by-plan-id/${planId}`,
      method: 'GET'
    },
    false,
    true,
    'manage_transport.transportCommand'
  )
}

function editTransportScheduleByPlanId(planId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-schedule/edit-by-plan-id/${planId}`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'manage_transport.transportCommand'
  )
}

/**
 * data = {planId: , vehicleId, status, description}
 * @param {*} id
 * @param {*} data
 * @returns
 */
function changeTransportRequirementProcess(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-schedule/change-transport-requirement-process`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'manage_transport.transportCommand'
  )
}

function driverSendMessage(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-schedule/driver-send-message`,
      method: 'POST',
      data: data
    },
    false,
    true,
    'manage_transport.transportCommand'
  )
}

function getTransportScheduleByCarrierId(carrierId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-schedule/get-schedule-route-by-carrier-id/${carrierId}`,
      method: 'GET'
    },
    false,
    true,
    'manage_transport.transportCommand'
  )
}

function changeTransportStatusByCarrierId(carrierId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport-schedule/change-transport-status-by-carrier-id/${carrierId}`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'manage_transport.transportCommand'
  )
}
