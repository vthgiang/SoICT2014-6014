import { sendRequest } from '../../../../../helpers/requestHelper'

function createPayment(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/payment`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.payment'
  )
}

function getAllPayments(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/payment`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.payment'
  )
}

function getPaymentDetail(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/payment/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_order.payment'
  )
}

// Lấy các thanh toán cho đơn hàng
function getPaymentForOrder({ orderId, orderType }) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/payment/get-for-order`,
      method: 'GET',
      params: { orderId, orderType }
    },
    false,
    true,
    'manage_order.payment'
  )
}

export const PaymentServices = {
  createPayment,
  getAllPayments,
  getPaymentDetail,
  getPaymentForOrder
}
