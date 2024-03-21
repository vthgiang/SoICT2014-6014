import { sendRequest } from '../../../../../helpers/requestHelper'

export const BillServices = {
  getBillsByType,
  getAllBillsByGroup,
  getBillByGood,
  getDetailBill,
  createBill,
  editBill,
  getBillsByStatus,
  getBillsByCommand,
  createManyProductBills,
  getNumberBills
}

function getBillsByType(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.bill_management'
  )
}

function getAllBillsByGroup(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills/get-all-bills-by-group`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.bill_management'
  )
}

function getBillByGood(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills/get-bill-by-good`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.bill_management'
  )
}

function getDetailBill(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills/get-detail-bill/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_warehouse.bill_management'
  )
}

function createBill(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_warehouse.bill_management'
  )
}

function editBill(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_warehouse.bill_management'
  )
}

function getBillsByStatus(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills/get-bill-by-status`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.bill_management'
  )
}

function getBillsByCommand(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills/bill-by-command`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.bill_management'
  )
}

function createManyProductBills(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills/create-many-product-bills`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_warehouse.bill_management'
  )
}

function getNumberBills(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bills/get-number-bill`,
      method: 'GET',
      params
    },
    false,
    false,
    'manage_warehouse.bill_management'
  )
}
