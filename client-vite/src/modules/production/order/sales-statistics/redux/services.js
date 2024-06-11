import { sendRequest } from '../../../../../helpers/requestHelper'

const getGoodsByType = (params) => {
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

const getAllGoods = (params) => {
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

const getAllGoodsByType = (query) => {
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

const getAllGoodsByCategory = (id) => {
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

const getGoodDetail = (id) => {
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

const deleteGood = (id) => {
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

const getTaxByGoodsId = (goodId) => {
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

const getSlaByGoodsId = (goodId) => {
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

const getDiscountByGoodsId = (goodId) => {
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

const getGoodByManageWorkRole = (roleId) => {
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

const getManufacturingWorksByProductId = (productId) => {
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

const getNumberGoods = () => {
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

const importGood = (data) => {
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

export const GoodServices = {
  getGoodsByType,
  getAllGoods,
  getAllGoodsByType,
  getAllGoodsByCategory,
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
