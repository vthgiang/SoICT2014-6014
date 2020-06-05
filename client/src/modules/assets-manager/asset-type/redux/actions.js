import {AssetTypeConstants} from "./constants";
import {AssetTypeService} from "./services";
export const AssetTypeActions = {
    searchAssetTypes,
    createAssetType,
    deleteAssetType,
    updateAssetType,
};

// lấy danh sách loại tài sản
function searchAssetTypes(data) {

    return dispatch => {
        dispatch({
            type: AssetTypeConstants.GET_ASSET_TYPE_REQUEST
        });
        AssetTypeService.searchAssetTypes(data)
            .then(res => {
                dispatch({
                    type: AssetTypeConstants.GET_ASSET_TYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetTypeConstants.GET_ASSET_TYPE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Tạo mới thông tin loại tài sản
function createAssetType(data) {
    return dispatch => {
        dispatch({
            type: AssetTypeConstants.CREATE_ASSET_TYPE_REQUEST
        });
        AssetTypeService.createAssetType(data)
            .then(res => {
                dispatch(searchAssetTypes({ typeNumber: "",
                    typeName: "",
                    page: 0,
                    limit: 100,}))
                dispatch({
                    type: AssetTypeConstants.CREATE_ASSET_TYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetTypeConstants.CREATE_ASSET_TYPE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Xoá thông tin thông tin loại tài sản
function deleteAssetType(id) {
    return dispatch => {
        dispatch({
            type: AssetTypeConstants.DELETE_ASSET_TYPE_REQUEST,
        });
        AssetTypeService.deleteAssetType(id)
            .then(res => {
                dispatch({
                    type: AssetTypeConstants.DELETE_ASSET_TYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetTypeConstants.DELETE_ASSET_TYPE_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin loại tài sản
function updateAssetType(id, infoAssetType) {
    return dispatch => {
        dispatch({
            type: AssetTypeConstants.UPDATE_ASSET_TYPE_REQUEST
        });
        AssetTypeService.updateAssetType(id, infoAssetType)
            .then(res => {
                dispatch(searchAssetTypes({ typeNumber: "",
                    typeName: "",
                    page: 0,
                    limit: 100,}));
                dispatch({
                    type: AssetTypeConstants.UPDATE_ASSET_TYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetTypeConstants.UPDATE_ASSET_TYPE_FAILURE,
                    error: err.response.data
                });
            })
    }
}


