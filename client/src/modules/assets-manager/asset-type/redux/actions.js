import {
    AssetTypeConstants
} from "./constants";
import {
    AssetTypeService
} from "./services";
import { AlertActions } from "../../../alert/redux/actions";
export const AssetTypeActions = {
    getListAssetType,
    createNewAssetType,
    deleteAssetType,
    updateAssetType,
};

// lấy danh sách loại tài sản
function getListAssetType(data) {
    return dispatch => {
        dispatch(request());

        AssetTypeService.getListAssetType(data)
            .then(
                listAssetType => dispatch(success(listAssetType)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: AssetTypeConstants.GET_ASSETTYPE_REQUEST,
        };
    };

    function success(listAssetType) {
        return {
            type: AssetTypeConstants.GET_ASSETTYPE_SUCCESS,
            listAssetType
        };
    };

    function failure(error) {
        return {
            type: AssetTypeConstants.GET_ASSETTYPE_FAILURE,
            error
        };
    };
}

// Tạo mới thông tin nghỉ phép
function createNewAssetType(data) {
    return dispatch => {
        dispatch({
            type: AssetTypeConstants.CREATE_ASSETTYPE_REQUEST
        });
        return new Promise((resolve, reject) => {
            AssetTypeService.createNewAssetType(data)
                .then(res => {
                    dispatch({
                        type: AssetTypeConstants.CREATE_ASSETTYPE_SUCCESS,
                        payload: res.data.content
                    })
                    resolve(res.data.content);
                })
                .catch(err => {
                    dispatch({
                        type: AssetTypeConstants.CREATE_ASSETTYPE_FAILURE,
                        error: err.response.data
                    });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                })
        })
    }
}

// Xoá thông tin loại tài sản
function deleteAssetType(id) {
    return dispatch => {
        dispatch(request());

        AssetTypeService.deleteAssetType(id)
            .then(
                assetTypeDelete => dispatch(success(assetTypeDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: AssetTypeConstants.DELETE_ASSETTYPE_REQUEST,
        };
    };

    function success(assetTypeDelete) {
        return {
            type: AssetTypeConstants.DELETE_ASSETTYPE_SUCCESS,
            assetTypeDelete
        };
    };

    function failure(error) {
        return {
            type: AssetTypeConstants.DELETE_ASSETTYPE_FAILURE,
            error
        };
    };
}

// cập nhật thông tin loại tài sản
function updateAssetType(id, infoAssetType) {
    return dispatch => {
        dispatch(request());

        AssetTypeService.updateAssetType(id, infoAssetType)
            .then(
                infoAssetType => dispatch(success(infoAssetType)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: AssetTypeConstants.UPDATE_ASSETTYPE_REQUEST,
        };
    };

    function success(infoAssetType) {
        return {
            type: AssetTypeConstants.UPDATE_ASSETTYPE_SUCCESS,
            infoAssetType
        };
    };

    function failure(error) {
        return {
            type: AssetTypeConstants.UPDATE_ASSETTYPE_FAILURE,
            error
        };
    };
}