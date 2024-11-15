import { sendRequest } from '../../../../../helpers/requestHelper'

export const SalesOrderSevices = {
  createNewSalesOrder,
  getAllSalesOrders,
  editSalesOrder,
  approveSalesOrder,
  addManufacturingPlanForGood,
  getSalesOrdersByManufacturingWorks,
  getSalesOrdersForPayment,
  getSalesOrderDetail,
  countSalesOrder,
  getTopGoodsSold,
  getSalesForDepartments,
  getNumberWorksSalesOrder,
  importSales,
}

function createNewSalesOrder(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.sales_order'
  )
}

function getAllSalesOrders(queryData) {
    return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.sales_order'
  )

}

function editSalesOrder(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.sales_order'
  )
}

function approveSalesOrder(id, data) {
  console.log('DATA', data)
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/approve/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_order.sales_order'
  )
}

function addManufacturingPlanForGood(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/add-manufacturing-plan/${id}`,
      method: 'PATCH',
      data
    },
    false,
    true,
    'manage_order.sales_order'
  )
}

function getSalesOrdersByManufacturingWorks(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/get-by-manufacturing-works/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_order.sales_order'
  )
}

function getSalesOrdersForPayment(customerId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/get-for-payment`,
      method: 'GET',
      params: { customerId }
    },
    false,
    true,
    'manage_order.sales_order'
  )
}

function getSalesOrderDetail(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_order.sales_order'
  )
}

// SERVICE CHO DASHBOARD
function countSalesOrder(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/count`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.sales_order'
  )
}

function getTopGoodsSold(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/get-top-good-sold`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.sales_order'
  )
}

function getSalesForDepartments(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/get-sales-for-departments`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_order.sales_order'
  )
}

function getNumberWorksSalesOrder(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/get-number-works-sales-order`,
      method: 'GET',
      params: data
    },
    false,
    true,
    'manage_order.sales_order'
  )
}

function importSales(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sales-order/imports`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_order.sales_order'
  )
}
