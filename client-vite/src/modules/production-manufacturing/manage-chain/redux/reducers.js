import { managerChainConstants } from './constants';

const initialState = {
    lists: [],
    allAssetTemplate: [],
    isLoading: false,
    error: null,
    assetTemplate: undefined,
    totalList: 0,
}

export function manufacturingLineTemplate(state = initialState, action) {
    switch (action.type) {
        case managerChainConstants.GET_ALL_CHAINS_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case managerChainConstants.GET_ALL_CHAINS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                lists: action.payload.data,
                totalList: action.payload.totalList,
            }
        case managerChainConstants.GET_ALL_CHAINS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case managerChainConstants.GET_CHAIN_BY_ID_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case managerChainConstants.GET_CHAIN_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                templateById: action.payload
            }
        case managerChainConstants.GET_CHAIN_BY_ID_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case managerChainConstants.CREATE_CHAIN_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case managerChainConstants.CREATE_CHAIN_TEMPLATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                lists: action.payload.data
            }
        case managerChainConstants.CREATE_CHAIN_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case managerChainConstants.EDIT_CHAIN_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case managerChainConstants.EDIT_CHAIN_TEMPLATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                lists: action.payload.data
            }
        case managerChainConstants.EDIT_CHAIN_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case managerChainConstants.DELETE_CHAIN_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case managerChainConstants.DELETE_CHAIN_TEMPLATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                lists: action.payload.data
            }
        case managerChainConstants.DELETE_CHAIN_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case managerChainConstants.GET_ASSET_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case managerChainConstants.GET_ASSET_TEMPLATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allAssetTemplate: action.payload.data
            }
        case managerChainConstants.GET_ASSET_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case managerChainConstants.GET_ASSET_TEMPLATE_BY_ID_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case managerChainConstants.GET_ASSET_TEMPLATE_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                assetTemplate: action.payload.data
            }
        case managerChainConstants.GET_ASSET_TEMPLATE_BY_ID_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case managerChainConstants.CREATE_ASSET_TEMPLATE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case managerChainConstants.CREATE_ASSET_TEMPLATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allAssetTemplate: action.payload.data
            }
        case managerChainConstants.CREATE_ASSET_TEMPLATE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        default:
            return state;
    }
}