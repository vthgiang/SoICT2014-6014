import {
    sendRequest
} from '../../../../../helpers/requestHelper';

export const AssetService = {
    getAll,
    addNewAsset,
    updateInformationAsset,
    deleteAsset,
    getListBuildingAsTree,
}

/**
 * Lấy danh sách tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAll(data) {
    console.log("\n\n\n\n\n\n\n\n",data)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets`,
        method: 'GET',
        params: {
            code: data !== undefined ? data.code : data,
            assetName: data !== undefined ? data.assetName : data,
            status: data !== undefined ? data.status : data,
            purchaseDate: data !== undefined ? data.purchaseDate : data,
            canRegisterForUse: data !== undefined ? data.canRegisterForUse : data,
            page: data !== undefined ? data.page : data,
            limit: data !== undefined ? data.limit : data,
            managedBy: data!== undefined? data.managedBy:data
        }
    }, false, true, 'asset.asset_info');
}

/**
 * Lấy danh sách mặt bằng dạng cây
 */
function getListBuildingAsTree() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets`,
        method: 'GET',
        params: {
            type: "get-building-as-tree"
        }
    }, false, true, 'asset.asset_info');
}

/**
 * Thêm mới thông tin tài sản
 * @param {*} data : dữ liệu thông tin tài sản cần tạo
 */
function addNewAsset(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets`,
        method: 'POST',
        data: data,
    }, true, true, 'asset.asset_info');
}

/**
 * Cập nhật thông tin tài sản theo id
 * @param {*} id : id thông tin tài sản cần chỉnh sửa
 * @param {*} data :dữ liệu chỉnh sửa thông tin tài sản
 */
function updateInformationAsset(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'asset.asset_info');
}

/**
 * Xoá thông tin tài sản
 * @id : id thông tin tài sản cần xoá
 */
function deleteAsset(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset/assets/${id}`,
        method: 'DELETE',
    }, true, true, 'asset.asset_info');
}