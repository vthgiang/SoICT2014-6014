import { managerChainServices } from './services';
import { managerChainConstants } from './constants';

export const ManagerChainActions = {
    getChainsList,
    getProductionLineTemplateById,
    createChainTemplate,
    editChainTemplate,
    deleteChainTemplate,
    getAllAssetTemplate,
    getAssetTemplateById,
    createAssetTemplate,
}

function getProductionLineTemplateById(id) {
    return (dispatch) => {
        dispatch({
            type: managerChainConstants.GET_CHAIN_BY_ID_REQUEST
        });
        managerChainServices.getChainTemplateById(id).then((response) => {
            dispatch({
                type: managerChainConstants.GET_CHAIN_BY_ID_SUCCESS,
                payload: response.data.content,
            })
        }).catch((error) => {
            dispatch({
                type: managerChainConstants.GET_CHAIN_BY_ID_FAILURE,
                error
            })
        })
    }
}

function getChainsList(queryData) {
    return (dispatch) => {
        dispatch({
            type: managerChainConstants.GET_ALL_CHAINS_REQUEST
        });

        managerChainServices.getChains(queryData)
            .then(response => {
                dispatch({
                    type: managerChainConstants.GET_ALL_CHAINS_SUCCESS,
                    payload: response.data.content,
                })
            })
            .catch((error) => {
                dispatch({
                    type: managerChainConstants.GET_ALL_CHAINS_FAILURE,
                    error
                })
            });
    }
}

export function createChainTemplate(data) {
    return (dispatch) => {
        dispatch({
            type: managerChainConstants.CREATE_CHAIN_TEMPLATE_REQUEST
        });

        managerChainServices.createChainTemplate(data)
            .then((response) => {
                dispatch({
                    type: managerChainConstants.CREATE_CHAIN_TEMPLATE_SUCCESS,
                    payload: response.data.content
                })
            })
            .catch((error) => {
                dispatch({
                    type: managerChainConstants.DELETE_CHAIN_TEMPLATE_FAILURE,
                    error
                })
            });
    }
}

export function editChainTemplate(id, data) {
    return (dispatch) => {
        dispatch({
            type: managerChainConstants.EDIT_CHAIN_TEMPLATE_REQUEST,
        });
        managerChainServices.editChainTemplate(id, data)
            .then((response) => {
                dispatch({
                    type: managerChainConstants.EDIT_CHAIN_TEMPLATE_SUCCESS,
                    payload: response.data.content,
                })
            })
            .catch((error) => {
                dispatch({
                    type: managerChainConstants.EDIT_CHAIN_TEMPLATE_FAILURE,
                    error
                })
            })
    }
}

export function deleteChainTemplate(id) {
    return (dispatch) => {
        dispatch({
            type: managerChainConstants.DELETE_CHAIN_TEMPLATE_REQUEST
        });
        managerChainServices.deleteChainTemplate(id)
            .then((response) => {
                dispatch({
                    type: managerChainConstants.DELETE_CHAIN_TEMPLATE_SUCCESS,
                    payload: response.data.content,
                })
            })
            .catch((error) => {
                dispatch({
                    type: managerChainConstants.DELETE_CHAIN_TEMPLATE_FAILURE,
                    error
                })
            });
    }
}

// Phần lấy tất cả tài sản mẫu cho công việc

function getAllAssetTemplate(queryData) {
    return (dispatch) => {
        dispatch({
            type: managerChainConstants.GET_ASSET_TEMPLATE_REQUEST
        });

        managerChainServices.getAllAssetTemplate(queryData)
            .then(response => {
                dispatch({
                    type: managerChainConstants.GET_ASSET_TEMPLATE_SUCCESS,
                    payload: response.data.content,
                })
            })
            .catch((error) => {
                dispatch({
                    type: managerChainConstants.GET_ASSET_TEMPLATE_FAILURE,
                    error
                })
            });
    }
}

function getAssetTemplateById(id) {
    return (dispatch) => {
        dispatch({
            type: managerChainConstants.GET_ASSET_TEMPLATE_BY_ID_REQUEST
        });
        managerChainServices.getAssetTemplateById(id).then((response) => {
            dispatch({
                type: managerChainConstants.GET_ASSET_TEMPLATE_BY_ID_SUCCESS,
                payload: response.data.content,
            })
        }).catch((error) => {
            dispatch({
                type: managerChainConstants.GET_ASSET_TEMPLATE_BY_ID_FAILURE,
                error
            })
        })
    }
}

export function createAssetTemplate(data) {
    return (dispatch) => {
        dispatch({
            type: managerChainConstants.CREATE_ASSET_TEMPLATE_REQUEST
        });

        managerChainServices.createAssetTemplate(data)
            .then((response) => {
                dispatch({
                    type: managerChainConstants.CREATE_ASSET_TEMPLATE_SUCCESS,
                    payload: response.data.content
                })
            })
            .catch((error) => {
                dispatch({
                    type: managerChainConstants.CREATE_ASSET_TEMPLATE_FAILURE,
                    error
                })
            });
    }
}