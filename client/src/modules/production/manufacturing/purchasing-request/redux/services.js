import { sendRequest } from '../../../../../helpers/requestHelper'

export const purchasingRequestServices = {
  getAllPurchasingRequests,
  createPurchasingRequest,
  getDetailPurchasingRequest,
  editPurchasingRequest,
  getNumberPurchasingStatus
}

function getAllPurchasingRequests(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchasing-request`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.purchasing_request'
  )
}

function createPurchasingRequest(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchasing-request`,
      method: 'POST',
      data
    },
    true,
    true,
    'manufacturing.purchasing_request'
  )
}

function getDetailPurchasingRequest(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchasing-request/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.purchasing_request'
  )
}

function editPurchasingRequest(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchasing-request/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manufacturing.purchasing_request'
  )
}

function getNumberPurchasingStatus(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchasing-request/get-number-purchasing-request`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.purchasing_request'
  )
}
