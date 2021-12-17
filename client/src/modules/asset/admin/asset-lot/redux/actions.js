import { dispatch } from "d3-dispatch";
import { AssetLotConstants } from "./constants";
import { AssetLotService } from "./services";

export const AssetLotManagerActions = {
    getAllAssetLots,
    createAssetLot,
    updateAssetLot,
    deleteAssetLots,
    getAssetLotInforById,
};

/**
 * Lấy danh sách lô tài sản
 * @param {*} data : dữ liệu key tìm kiếm
 */
function getAllAssetLots(data) {
    return (dispatch) => {
        dispatch({
            type: AssetLotConstants.GETALL_REQUEST,
        });
        AssetLotService.getAllAssetLots(data)
            .then((res) => {
                dispatch({
                    type: AssetLotConstants.GETALL_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: AssetLotConstants.GETALL_FAILURE,
                    error: err,
                });
            });
    };
}
/**
 * Thêm lô tài sản
 * @param {*} data: code, assetLotName, total, price, assetType, group, listAsset 
 */
function createAssetLot(data) {
    return (dispatch) => {
        // tao moi
        // dispatch({
        //     type: AssetLotConstants.CREATE_ASSETLOT_REQUEST,
        // });
        // // 
        AssetLotService.createAssetLot(data)
            .then((res) => {
                // console.log("hang action:", res.data);
                if (res.data) {
                    dispatch({
                        type: AssetLotConstants.CREATE_ASSETLOT_SUCCESS,
                        payload: res.data.content
                    });
                }

            }).catch((err) => {
                //console.log("hang action err: ", err);
                dispatch({
                    type: AssetLotConstants.CREATE_ASSETLOT_FAILURE,
                    error: err,
                    payload: err.response.data.content
                });
            });
    }
}

/**
 * Cập nhật lô tài sản
 * @param {*} id
 * @param {*} data
 */
function updateAssetLot(id, data) {
    return (dispatch) => {
        dispatch({
            type: AssetLotConstants.UPDATE_ASSETLOT_REQUEST,
        });
        AssetLotService.updateAssetLot(id, data)
            .then((res) => {
                dispatch({
                    type: AssetLotConstants.UPDATE_ASSETLOT_SUCCESS,
                    payload: res.data.content
                });
            }).catch((err) => {
                dispatch({
                    type: AssetLotConstants.UPDATE_ASSETLOT_FAILURE,
                    error: err,
                });
            });
    }
}

/**
 * Xóa lô tài sản
 * @param {*} data
 */
function deleteAssetLots(data) {
    return (dispatch) => {
        dispatch({
            type: AssetLotConstants.DELETE_ASSETLOT_REQUEST,
        });
        AssetLotService.deleteAssetLots(data)
            .then((res) => {
                dispatch({
                    type: AssetLotConstants.DELETE_ASSETLOT_SUCCESS,
                    payload: res.data.content,
                    assetLotIds: data.assetLotIds
                });
            }).catch((err) => {
                dispatch({
                    type: AssetLotConstants.DELETE_ASSETLOT_FAILURE,
                    error: err,
                });
            });
    }
}

/**
 * Lấy thông tin lô tài sản
 * @param {*} id 
 * @returns 
 */
function getAssetLotInforById(id) {
    return (dispatch) => {
        dispatch({
            type: AssetLotConstants.GET_ASSET_LOT_INFOR_REQUEST,
        });
        AssetLotService.getAssetLotInforById(id)
            .then((res) => {
                dispatch({
                    type: AssetLotConstants.GET_ASSET_LOT_INFOR_SUCCESS,
                    payload: res.data.content,
                });
            }).catch((err) => {
                dispatch({
                    type: AssetLotConstants.GET_ASSET_LOT_INFOR_FAILURE,
                    error: err,
                });
            });
    }
}

/**
 * 
 * action thay doi state reducer
 */
export const saveListAssetsAction = (listAssets) => ({
    type: AssetLotConstants.UPDATE_LIST_ASSETS_ACTION, // dinh danh cho action
    listAssets: listAssets
})

export const updateAssetLotAction = (assetLot) => ({
    type: AssetLotConstants.UPDATE_ASSET_LOT_ACTION, // dinh danh cho action
    assetLot: assetLot,
})

export const putAssetLotCurrentAction = (currentRow)=>({
    type: AssetLotConstants.PUT_ASSETLOT_CURRENT_ROW,
    currentRow
})