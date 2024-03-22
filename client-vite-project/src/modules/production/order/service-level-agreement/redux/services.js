import { sendRequest } from '../../../../../helpers/requestHelper'

export const SLAServices = {
  createNewSLA,
  getAllSLAs,
  getSLAById,
  updateSLA,
  disableSLA,
  checkSLACode,
  getSLAByCode,
  deleteSLA
}

function createNewSLA(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.sla'
  )
}

function getAllSLAs(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.sla'
  )
}

function getSLAById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_order.sla'
  )
}

function updateSLA(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.sla'
  )
}

function disableSLA(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla/disable/${id}`,
      method: 'PATCH'
    },
    true,
    true,
    'manage_order.sla'
  )
}

function checkSLACode(code) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla/check-code`,
      method: 'GET',
      params: code
    },
    false,
    true,
    'manage_order.sla'
  )
}

function getSLAByCode(code) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla/get-by-code`,
      method: 'GET',
      params: code
    },
    false,
    true,
    'manage_order.sla'
  )
}

function deleteSLA(code) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla`,
      method: 'DELETE',
      params: code
    },
    true,
    true,
    'manage_order.sla'
  )
}
