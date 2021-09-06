import {AssetConstants} from "./constants";
import {AssetService} from "./services";

export const AssetManagerActions = {
    getAllAsset,
    addNewAsset,
    updateInformationAsset,
    deleteAsset,
    getListBuildingAsTree,
    getAllAssetGroup
};

/**
 * Lấy danh sách tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAllAsset(data) {
    return (dispatch) => {
        dispatch({
            type: AssetConstants.GETALL_REQUEST,
        });
        AssetService.getAll(data)
            .then((res) => {
                dispatch({
                    type: AssetConstants.GETALL_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: AssetConstants.GETALL_FAILURE,
                    error: err,
                });
            });
    };
}

/**
 * Lấy danh sách mặt bằng dạng cây
 */
function getListBuildingAsTree() {
    return (dispatch) => {
        dispatch({
            type: AssetConstants.GET_LIST_BUILDING_AS_TREE_REQUEST,
        });
        AssetService.getListBuildingAsTree()
            .then((res) => {
                dispatch({
                    type: AssetConstants.GET_LIST_BUILDING_AS_TREE_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: AssetConstants.GET_LIST_BUILDING_AS_TREE_FAILURE,
                    error: err,
                });
            });
    };
}

/**
 * Thêm mới thông tin tài sản
 * @param {*} data : dữ liệu thông tin tài sản cần tạo
 */
function addNewAsset(asset) {
    return (dispatch) => {
        dispatch({
            type: AssetConstants.ADDASSET_REQUEST,
        });

        AssetService.addNewAsset(asset)
            .then((res) => {
                dispatch({
                    type: AssetConstants.ADDASSET_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: AssetConstants.ADDASSET_FAILURE,
                    error: err,
                    payload: err.response.data.content
                });
            });
    };
}

/**
 * Cập nhật thông tin tài sản theo id
 * @param {*} id
 * @param {*} data
 * @param {*} managedBy khi manageBy !="", role gọi service này không phải là admin
 */
function updateInformationAsset(id, data, isImport = undefined) {
    return (dispatch) => {
        dispatch({
            type: AssetConstants.UPDATE_INFOR_ASSET_REQUEST,
        });

        AssetService.updateInformationAsset(id, data, isImport)
            .then((res) => {
                dispatch({
                    type: AssetConstants.UPDATE_INFOR_ASSET_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: AssetConstants.UPDATE_INFOR_ASSET_FAILURE,
                    error: err,
                });
            });
    };
}

/**
 * Xóa tài sản
 * @param {*} data
 */


function deleteAsset(data) {
    return (dispatch) => {
        dispatch({
            type: AssetConstants.DELETE_ASSET_REQUEST
        });

        AssetService
            .deleteAsset(data)
            .then((res) => {
                dispatch({
                    type: AssetConstants.DELETE_ASSET_SUCCESS,
                    payload: res.data.content,
                    assetIds: data.assetIds
                });
            })
            .catch((error) => {
                dispatch({
                    type: AssetConstants.DELETE_ASSET_FAILURE,
                    error
                });
            });
    }
}

function getAllAssetGroup(data) {
    return (dispatch) => {
        dispatch({
            type: AssetConstants.GET_ASSET_GROUP_REQUEST,
        });
        AssetService.getAllAssetGroup(data)
            .then((res) => {
                dispatch({
                    type: AssetConstants.GET_ASSET_GROUP_SUCCESS,
                    payload: res.data.content,
                });
                /* console.log("res",res.data) */
            })
            .catch((err) => {
                dispatch({
                    type: AssetConstants.GET_ASSET_GROUP_FAILURE,
                    error: err,
                });
            });
    };
}