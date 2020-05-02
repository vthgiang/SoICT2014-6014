import {
    AssetConstants
} from "./constants";
import {
    AssetService
} from "./services";
export const AssetManagerActions = {
    getAllAsset,
    addNewAsset,
    uploadAvatar,
    updateFile,
    updateInformationAsset,
    checkAssetNumber,
    deleteAsset,
};

// Lấy danh sách tài sản
function getAllAsset(data) {
    return dispatch => {
        dispatch(request());
        AssetService.getAll(data)
            .then(
                assets => dispatch(success(assets)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: AssetConstants.GETALL_REQUEST
        };
    };

    function success(assets) {
        return {
            type: AssetConstants.GETALL_SUCCESS,
            assets
        };
    };

    function failure(error) {
        return {
            type: AssetConstants.GETALL_FAILURE,
            error
        };
    };
}

// Kiểm tra sự tồn tại của AssetNumber
function checkAssetNumber(assetNumber) {
    return dispatch => {
        dispatch(request());
        AssetService.checkAssetNumber(assetNumber)
            .then(
                checkAssetNumber => dispatch(success(checkAssetNumber)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: AssetConstants.CHECK_ASSETNUMBER_REQUEST
        };
    };

    function success(checkAssetNumber) {
        return {
            type: AssetConstants.CHECK_ASSETNUMBER_SUCCESS,
            checkAssetNumber
        };
    };

    function failure(error) {
        return {
            type: AssetConstants.CHECK_ASSETNUMBER_FAILURE,
            error
        };
    };
}


// Tạo mới một tài sản mới
function addNewAsset(asset) {
    return dispatch => {
        dispatch(request(asset));

        AssetService.addNewAsset(asset)
            .then(
                asset => {
                    dispatch(success(asset));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(asset) {
        return {
            type: AssetConstants.ADDASSET_REQUEST,
            asset
        }
    };

    function success(asset) {
        return {
            type: AssetConstants.ADDASSET_SUCCESS,
            asset
        }
    };

    function failure(error) {
        return {
            type: AssetConstants.ADDASSET_FAILURE,
            error
        }
    };
}

// update thông tin tài sản theo id
function updateInformationAsset(id, informationAsset) {
    return dispatch => {
        dispatch(request());

        AssetService.updateInformationAsset(id, informationAsset)
            .then(
                informationAsset => {
                    dispatch(success(informationAsset));
                },
                error => {
                    dispatch(failure(error).toString());
                }
            );
    };

    function request() {
        return {
            type: AssetConstants.UPDATE_INFOR_ASSET_REQUEST,
        }
    };

    function success(informationAsset) {
        return {
            type: AssetConstants.UPDATE_INFOR_ASSET_SUCCESS,
            informationAsset
        }
    };

    function failure(error) {
        return {
            type: AssetConstants.UPDATE_INFOR_ASSET_FAILURE,
            error
        }
    };

}

// Cập nhật ảnh tài sản
function uploadAvatar(assetNumber, fileUpload) {
    return dispatch => {
        dispatch({
            type: AssetConstants.UPLOAD_AVATAR_REQUEST
        });
        AssetService.uploadAvatar(assetNumber, fileUpload)
            .then(res => {
                dispatch({
                    type: AssetConstants.UPLOAD_AVATAR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetConstants.UPLOAD_AVATAR_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Cập nhật(thêm) thông tin tài liệu đính kèm theo AssetNumber
function updateFile(assetNumber, fileUpload) {
    return dispatch => {
        dispatch(request());
        AssetService.updateFile(assetNumber, fileUpload)
            .then(
                file => dispatch(success(file)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: AssetConstants.UPDATE_FILE_REQUEST,
        };
    };

    function success(file) {
        return {
            type: AssetConstants.UPDATE_FILE_SUCCESS,
            file
        };
    };

    function failure(error) {
        return {
            type: AssetConstants.UPDATE_FILE_FAILURE,
            error
        };
    };
}

// Xoá thông tin tài sản
function deleteAsset(id) {
    return dispatch => {
        dispatch(request());

        AssetService.deleteAsset(id)
            .then(
                assetDelete => dispatch(success(assetDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: AssetConstants.DELETE_ASSET_REQUEST,
        };
    };

    function success(assetDelete) {
        return {
            type: AssetConstants.DELETE_ASSET_SUCCESS,
            assetDelete
        };
    };

    function failure(error) {
        return {
            type: AssetConstants.DELETE_ASSET_FAILURE,
            error
        };
    };
}
