import {
    AssetTypeConstants
} from "./constants";
import {
    AssetTypeService
} from "./services";

export const AssetTypeActions = {
    searchAssetTypes,
    getAssetTypes,
    createAssetTypes,
    editAssetType,
    deleteAssetTypes,
};

// Lấy danh sách loại tài sản
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
                    // error: err.response.data
                });
            })
    }
}

// Lấy tất cả loại tài sản
function getAssetTypes() {
    return dispatch => {
        dispatch({
            type: AssetTypeConstants.GET_DOCUMENT_DOMAINS_REQUEST
        });
        AssetTypeService.getAssetTypes()
            .then(res => {
                dispatch({
                    type: AssetTypeConstants.GET_DOCUMENT_DOMAINS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetTypeConstants.GET_DOCUMENT_DOMAINS_FAILE
                });

            })
    }
}

function createAssetTypes(data) {
    return dispatch => {
        dispatch({
            type: AssetTypeConstants.CREATE_DOCUMENT_DOMAIN_REQUEST
        });
        AssetTypeService.createAssetTypes(data)
            .then(res => {
                dispatch({
                    type: AssetTypeConstants.CREATE_DOCUMENT_DOMAIN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetTypeConstants.CREATE_DOCUMENT_DOMAIN_FAILE
                });
            })
    }
}

function editAssetType(id, data) {
    return dispatch => {
        dispatch({
            type: AssetTypeConstants.EDIT_DOCUMENT_DOMAIN_REQUEST
        });
        AssetTypeService.editAssetType(id, data)
            .then(res => {
                dispatch({
                    type: AssetTypeConstants.EDIT_DOCUMENT_DOMAIN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AssetTypeConstants.EDIT_DOCUMENT_DOMAIN_FAILE
                });
            })
    }
}

function deleteAssetTypes(data, type = "single") {
    return dispatch => {
        dispatch({
            type: AssetTypeConstants.DELETE_DOCUMENT_DOMAIN_REQUEST
        });
        if (type !== 'single') {
            AssetTypeService.deleteManyAssetType(data)
                .then(res => {
                    dispatch({
                        type: AssetTypeConstants.DELETE_DOCUMENT_DOMAIN_SUCCESS,
                        payload: {
                            list: res.data.content.list,
                            tree: res.data.content.tree
                        }
                    })
                })
                .catch(err => {
                    dispatch({
                        type: AssetTypeConstants.DELETE_DOCUMENT_DOMAIN_FAILE
                    });
                })
        } else {
            AssetTypeService.deleteAssetTypes(data)
                .then(res => {
                    dispatch({
                        type: AssetTypeConstants.DELETE_DOCUMENT_DOMAIN_SUCCESS,
                        payload: {
                            list: res.data.content.list,
                            tree: res.data.content.tree
                        }
                    })
                })
                .catch(err => {
                    dispatch({
                        type: AssetTypeConstants.DELETE_DOCUMENT_DOMAIN_FAILE
                    });
                })
        }
    }
}