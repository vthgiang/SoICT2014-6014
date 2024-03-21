import { sendRequest } from '../../../../../helpers/requestHelper'

export const GoodServices = {
  getGoodsByType,
  getAllGoods,
  getAllGoodsByType,
  getAllGoodsByCategory,
  createGoodByType,
  editGood,
  getGoodDetail,
  deleteGood,
  getTaxByGoodsId,
  getSlaByGoodsId,
  getDiscountByGoodsId,
  getGoodByManageWorkRole,
  getManufacturingWorksByProductId,
  getNumberGoods,
  importGood
}

function getGoodsByType(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.good_management'
  )
}

function getAllGoods(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/all-goods`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.good_management'
  )
}

function getAllGoodsByType(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/by-type`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manage_warehouse.good_management'
  )
}

function getAllGoodsByCategory(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/by-category/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_warehouse.good_management'
  )
}

function createGoodByType(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_warehouse.good_management'
  )
}

function getGoodDetail(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_warehouse.good_management'
  )
}

function editGood(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_warehouse.good_management'
  )
}

function deleteGood(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'manage_warehouse.good_management'
  )
}

function getTaxByGoodsId(goodId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/tax/get-by-good-id`,
      method: 'GET',
      params: { goodId }
    },
    false,
    true,
    'manage_order.tax'
  )
}

function getSlaByGoodsId(goodId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/sla/get-by-good-id`,
      method: 'GET',
      params: { goodId }
    },
    false,
    true,
    'manage_order.sla'
  )
}

function getDiscountByGoodsId(goodId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/discount/get-by-good-id`,
      method: 'GET',
      params: { goodId }
    },
    false,
    true,
    'manage_order.discount'
  )
}

function getGoodByManageWorkRole(roleId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/by-manage-works-role/role/${roleId}`,
      method: 'GET'
    },
    false,
    true,
    'manage_warehouse.good_management'
  )
}

function getManufacturingWorksByProductId(productId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/get-works-by-product-id/${productId}`,
      method: 'GET'
    },
    false,
    true,
    'manage_warehouse.good_management'
  )
}

function getNumberGoods() {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/get-number-good`,
      method: 'GET'
    },
    false,
    false,
    'manage_warehouse.good_management'
  )
}

function importGood(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/goods/imports`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_warehouse.good_management'
  )
}
