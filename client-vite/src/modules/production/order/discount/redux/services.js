import { sendRequest } from '../../../../../helpers/requestHelper'

export const DiscountServices = {
  createNewDiscount,
  getAllDiscounts,
  editDiscount,
  changeDiscountStatus,
  deleteDiscountByCode,
  getDiscountForOrderValue
}

function createNewDiscount(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/discount`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.discount'
  )
}

function getAllDiscounts(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/discount`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.discount'
  )
}

function editDiscount(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/discount/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.discount'
  )
}

function changeDiscountStatus(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/discount/change-status/${id}`,
      method: 'PATCH'
    },
    false,
    true,
    'manage_order.discount'
  )
}

function deleteDiscountByCode(code) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/discount`,
      method: 'DELETE',
      params: code
    },
    true,
    true,
    'manage_order.discount'
  )
}

function getDiscountForOrderValue() {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/discount/get-by-order-value`,
      method: 'GET'
    },
    false,
    true,
    'manage_order.discount'
  )
}
