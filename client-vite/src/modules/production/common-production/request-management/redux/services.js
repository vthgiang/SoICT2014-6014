import { sendRequest } from '../../../../../helpers/requestHelper'
import externalTransportSystem from '../../../../../helpers/requestExternalServerHelpers'

export const requestServices = {
  getAllRequestByCondition,
  createRequest,
  getDetailRequest,
  editRequest,
  getNumberStatus,
    syncCreateRequestTransport,
    getAllStockWithBinLocation,
    editTransportationRequest
}

function getAllRequestByCondition(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/product-request-management`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.purchasing_request'
  )
}

function createRequest(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/product-request-management`,
      method: 'POST',
      data
    },
    true,
    true,
    'manufacturing.purchasing_request'
  )
}

function getDetailRequest(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/product-request-management/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.purchasing_request'
  )
}

function editRequest(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/product-request-management/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manufacturing.purchasing_request'
  )
}

function editTransportationRequest(id, data) {
  return sendRequest(
      {
          url: `${process.env.REACT_APP_SERVER}/product-request-management/edit-transportation/${id}`,
          method: "PATCH",
          data
      },
      true,
      true,
      'manufacturing.purchasing_request'
  )
}

function getNumberStatus(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/product-request-management/get-number-request`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.purchasing_request'
  )
}

function syncCreateRequestTransport(data) {
  return externalTransportSystem.post('orders/sync/create', data)
}

function getAllStockWithBinLocation(query) {
  return sendRequest(
      {
          url: `${process.env.REACT_APP_SERVER}/bin-locations/get-stock-bin-location`,
          method: "GET",
          params: query
      },
      false,
      true,
      'manufacturing.purchasing_request'
  )
}
