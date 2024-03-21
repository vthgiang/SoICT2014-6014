import { sendRequest } from '../../../../../helpers/requestHelper'

export const AssetLotService = {
  getAllAssetLots,
  createAssetLot,
  updateAssetLot,
  deleteAssetLots,
  getAssetLotInforById
}

/**
 * Lấy danh sách lô tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAllAssetLots(data) {
  //console.log("res",data)
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/assetlot/asset-lots`,
      method: 'GET',
      params: {
        getAll: data ? data.getAll : data,
        code: data ? data.code : data,
        assetLotName: data ? data.assetLotName : data,
        group: data ? data.group : data,
        assetType: data ? data.assetType : data,
        supplier: data ? data.supplier : data,
        page: data ? data.page : data,
        limit: data ? data.limit : data
      }
    },
    false,
    true,
    'asset.asset_lot'
  )
}
/**
 * Thêm lô tài sản
 * @param {*} data dữ liệu thông tin lô tài sản và danh sách tài sản trong lô
 */
function createAssetLot(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/assetlot/asset-lots`,
      method: 'POST',
      data: data
    },
    true,
    true,
    'asset.asset_lot'
  )
}
/**
 * Cập nhật thông tin lô tài sản
 * @param {*} id id lô tài sản cần update
 * @param {*} data dữ liệu lô tài sản update
 */
function updateAssetLot(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/assetlot/asset-lots/${id}`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'asset.asset_lot'
  )
}

/**
 * Xóa lô tài sản
 * @param {*} data danh sách id lô tài sản cần xóa
 */
function deleteAssetLots(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/assetlot/asset-lots`,
      method: 'DELETE',
      data: {
        assetLotIds: data?.assetLotIds
      }
    },
    true,
    true,
    'asset.asset_lot'
  )
}

function getAssetLotInforById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/assetlot/asset-lots/${id}`,
      method: 'GET'
    },
    false,
    true,
    'asset.asset_lot'
  )
}
