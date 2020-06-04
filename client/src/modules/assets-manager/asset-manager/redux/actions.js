import {AssetConstants} from "./constants";
import {AssetService} from "./services";
import {LOCAL_SERVER_API} from "../../../../env";
import {AuthenticateHeader} from "../../../../config";
import axios from 'axios'

export const AssetManagerActions = {
    getAllAsset,
    addNewAsset,
    uploadAvatar,
    updateFile,
    updateInformationAsset,
    checkCode,
    deleteAsset,
    uploadFile,
    saveTimeDepreciation
};

function uploadFile(data) {
    return axios.post(`${LOCAL_SERVER_API}/asset/uploadFile`, data, {headers: AuthenticateHeader()})
}

function saveTimeDepreciation(time,isChange) {
    return {
        type: AssetConstants.SAVE_TIME_DESPRECIATION,
        time,
        isChange
    }
}

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

// Kiểm tra sự tồn tại của Code
function checkCode(code) {
    return dispatch => {
        dispatch(request());
        AssetService.checkMSNV(code)
            .then(
                checkCode => dispatch(success(checkCode)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: AssetConstants.CHECK_CODE_REQUEST
        };
    };

    function success(checkCode) {
        return {
            type: AssetConstants.CHECK_CODE_SUCCESS,
            checkCode
        };
    };

    function failure(error) {
        return {
            type: AssetConstants.CHECK_CODE_FAILURE,
            error
        };
    };
}


// Tạo mới một tài sản mới
function addNewAsset(assetNew) {
    return dispatch => {
        dispatch(request(assetNew));
        axios.post(`${LOCAL_SERVER_API}/asset`, assetNew, {headers: AuthenticateHeader()}).then(
            asset => {
                dispatch(getAllAsset({
                    code: "",
                    assetName: "",
                    assetType: null,
                    month: "",
                    status: null,
                    page: 0,
                    limit: 5,
                }));
                dispatch(success(asset));
            },
            error => {
                dispatch(failure(error.toString()));
            }
        );
        // AssetService.addNewAsset(assetNew)
        //     .then(
        //         asset => {
        //             dispatch(getAllAsset({
        //                 code: "",
        //                 assetName: "",
        //                 assetType: null,
        //                 month: "",
        //                 status: null,
        //                 page: 0,
        //                 limit: 5,
        //             }));
        //             dispatch(success(asset));
        //         },
        //         error => {
        //             dispatch(failure(error.toString()));
        //         }
        //     );
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
                    dispatch(getAllAsset({
                        code: "",
                        assetName: "",
                        assetType: null,
                        month: "",
                        status: null,
                        page: 0,
                        limit: 5,
                    }));
                    dispatch(success(informationAsset));
                },
                error => {
                    dispatch(failure(error));
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
function uploadAvatar(code, fileUpload) {
    return dispatch => {
        dispatch({
            type: AssetConstants.UPLOAD_AVATAR_REQUEST
        });
        AssetService.uploadAvatar(code, fileUpload)
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

// Cập nhật(thêm) thông tin tài liệu đính kèm theo Code
function updateFile(code, fileUpload) {
    return dispatch => {
        dispatch(request());
        AssetService.updateFile(code, fileUpload)
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
