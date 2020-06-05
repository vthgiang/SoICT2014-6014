import { AssetCrashConstants } from "./constants";
import { AssetCrashService } from "./services";
import { AssetManagerActions } from "../../asset-manager/redux/actions";

export const AssetCrashActions = {
    searchAssetCrashs,
    createAssetCrash,
    deleteAssetCrash,
    updateAssetCrash,
};

// Lấy danh sách sự cố tài sản
function searchAssetCrashs(data) {

    return async (dispatch) => {
        try {
            const result = await AssetCrashService.searchAssetCrashs(data);

            dispatch({
                type: AssetCrashConstants.GET_ASSET_CRASH_SUCCESS,
                payload: result.data.content
            })

        } catch (error) {
            dispatch({
                type: AssetCrashConstants.GET_ASSET_CRASH_FAILURE,
                error: error.response.data
            });
        }
    };
}

// Tạo mới thông tin sự cố tài sản
function createAssetCrash(data) {
    return async dispatch => {
        try {
            dispatch({
                type: AssetCrashConstants.CREATE_ASSET_CRASH_REQUEST
            });
            const response = await AssetCrashService.createAssetCrash(data).then(res => res);
            dispatch(searchAssetCrashs({
                code: "",
                assetName: "",
                month: "",
                type: null,
                page: 0,
                limit: 5,
            }));
            dispatch({
                type: AssetCrashConstants.CREATE_ASSET_CRASH_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: AssetCrashConstants.CREATE_ASSET_CRASH_FAILURE,
                error: err.response.data
            });
        }

    }
}

// Xoá thông tin sự cố tài sản
function deleteAssetCrash(id) {
    return dispatch => {
        dispatch({
            type: AssetCrashConstants.DELETE_ASSET_CRASH_REQUEST,
        });
        AssetCrashService.deleteAssetCrash(id)
            .then(res => {
                dispatch(searchAssetCrashs({
                    code: "",
                    assetName: "",
                    month: "",
                    type: null,
                    page: 0,
                    limit: 5,
                }));
                dispatch({
                    type: AssetCrashConstants.DELETE_ASSET_CRASH_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetCrashConstants.DELETE_ASSET_CRASH_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin sự cố tài sản
function updateAssetCrash(id, infoAssetCrash) {
    return async dispatch => {
        try {
            dispatch({
                type: AssetCrashConstants.UPDATE_ASSET_CRASH_REQUEST
            });
            const response = await AssetCrashService.updateAssetCrash(id, infoAssetCrash)
            dispatch(searchAssetCrashs({
                code: "",
                assetName: "",
                month: "",
                type: null,
                page: 0,
                limit: 5,
            }));
            dispatch({
                type: AssetCrashConstants.UPDATE_ASSET_CRASH_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: AssetCrashConstants.UPDATE_ASSET_CRASH_FAILURE,
                error: err.response.data
            });
        }
    }
}
