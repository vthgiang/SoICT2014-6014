import { AssetTypeConstants } from './constants';
const initState = {
    isLoading: false,
    listAssetTypes: [],
    totalList: "",
    error:"",
}
export function assetType(state =initState, action) {
    switch (action.type) {
        case AssetTypeConstants.GET_ASSET_TYPE_REQUEST:
        case AssetTypeConstants.CREATE_ASSET_TYPE_REQUEST:
        case AssetTypeConstants.DELETE_ASSET_TYPE_REQUEST:
        case AssetTypeConstants.UPDATE_ASSET_TYPE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case AssetTypeConstants.GET_ASSET_TYPE_SUCCESS:
            // console.log(action);
            return {
                ...state,
                isLoading: false,
                listAssetTypes: action.payload,
                //totalList: action.payload.totalList,
            };
        case AssetTypeConstants.CREATE_ASSET_TYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetTypes: [...state.listAssetTypes, action.payload],
            };
        case AssetTypeConstants.DELETE_ASSET_TYPE_SUCCESS:

            return {
                ...state,
                isLoading: false,
                listAssetTypes: state.listAssetTypes.filter(assetType => (assetType._id !== action.payload._id)),
            };
        case AssetTypeConstants.UPDATE_ASSET_TYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetTypes: state.listAssetTypes.map(assetType =>assetType._id === action.payload._id ?action.payload : assetType),
            };
        case AssetTypeConstants.GET_ASSET_TYPE_FAILURE:
        case AssetTypeConstants.CREATE_ASSET_TYPE_FAILURE:
        case AssetTypeConstants.DELETE_ASSET_TYPE_FAILURE:
        case AssetTypeConstants.UPDATE_ASSET_TYPE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}
