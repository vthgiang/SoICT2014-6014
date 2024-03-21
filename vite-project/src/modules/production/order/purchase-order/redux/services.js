import { sendRequest } from '../../../../../helpers/requestHelper'

export const PurchaseOrderServices = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrder,
  getPurchaseOrdersForPayment,
  approvePurchaseOrder
}

function createPurchaseOrder(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchase-order`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.purchase_order'
  )
}

function getAllPurchaseOrders(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchase-order`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.purchase_order'
  )
}

function updatePurchaseOrder(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchase-order/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.purchase_order'
  )
}

function getPurchaseOrdersForPayment(supplierId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchase-order/get-for-payment`,
      method: 'GET',
      params: { supplierId }
    },
    false,
    true,
    'manage_order.purchase_order'
  )
}

function approvePurchaseOrder(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/purchase-order/approve/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.purchase_order'
  )
}
