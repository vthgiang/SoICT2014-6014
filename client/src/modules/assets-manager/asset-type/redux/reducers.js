import { AssetTypeConstants } from './constants';
const initState = {
    isLoading: false,
    listAssetType: [],
    totalList: "",
    error:"",
}
export function assetType(state =initState, action) {
    switch (action.type) {
        case AssetTypeConstants.GET_ASSETTYPE_REQUEST:
        case AssetTypeConstants.CREATE_ASSETTYPE_REQUEST:
        case AssetTypeConstants.DELETE_ASSETTYPE_REQUEST:
        case AssetTypeConstants.UPDATE_ASSETTYPE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case AssetTypeConstants.GET_ASSETTYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetType: action.payload.listAssetType,
                totalList: action.payload.totalList,   
            };
        case AssetTypeConstants.CREATE_ASSETTYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetType: [...state.listAssetType, action.payload],
            };
        case AssetTypeConstants.DELETE_ASSETTYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetType: state.listAssetType.filter(assetType => (assetType._id !== action.payload._id)),
            };
        case AssetTypeConstants.UPDATE_ASSETTYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetType: state.listAssetType.map(assetType =>assetType._id === action.payload._id ?action.payload : assetType),
            };
        case AssetTypeConstants.GET_ASSETTYPE_FAILURE:
        case AssetTypeConstants.CREATE_ASSETTYPE_FAILURE:
        case AssetTypeConstants.DELETE_ASSETTYPE_FAILURE:
        case AssetTypeConstants.UPDATE_ASSETTYPE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}