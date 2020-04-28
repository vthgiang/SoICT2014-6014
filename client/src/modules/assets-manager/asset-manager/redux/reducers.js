import {
    AssetConstants
} from './constants';
const initState = {
    checkArrayAssetNumber: []
}
export function assetsManager(state = initState, action) {
    switch (action.type) {
        case AssetConstants.GETALL_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.GETALL_SUCCESS:
            return {
                ...state,
                allAsset: action.assets.content.data,
                    totalList: action.assets.content.totalList,
                    isLoading: false
            };
        case AssetConstants.GETALL_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.ADDASSET_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.ADDASSET_SUCCESS:
            return {
                ...state,
                newAsset: action.asset,
                isLoading: false
            };
        case AssetConstants.ADDASSET_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.UPDATE_INFOR_ASSET_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPDATE_INFOR_ASSET_SUCCESS:
            return {
                ...state,
                infoAssetUpdate: action.informationAsset.content,
                isLoading: false
            };
        case AssetConstants.UPDATE_INFOR_ASSET_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.UPLOAD_AVATAR_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPLOAD_AVATAR_SUCCESS:
            return {
                ...state,
                avatarfile: action.payload,
                isLoading: false
            };
        case AssetConstants.UPLOAD_AVATAR_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.UPDATE_FILE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPDATE_FILE_SUCCESS:
            return {
                ...state,
                updateFile: action.file.content,
                isLoading: false
            };
        case AssetConstants.UPDATE_FILE_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.CHECK_ASSETNUMBER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.CHECK_ASSETNUMBER_SUCCESS:
            return {
                ...state,
                checkAssetNumber: action.checkAssetNumber.content,
                isLoading: false
            };
        case AssetConstants.CHECK_ASSETNUMBER_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };

        case AssetConstants.DELETE_ASSET_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case AssetConstants.DELETE_ASSET_SUCCESS:
            return {
                ...state,
                allAsset: state.allAsset.filter(list => (list.asset[0]._id !== action.assetDelete.content.infoAsset._id)),
                    isLoading: false,
            };
        case AssetConstants.DELETE_ASSET_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };

        case AssetConstants.CHECK_ARRAY_ASSETNUMBER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.CHECK_ARRAY_ASSETNUMBER_SUCCESS:
            return {
                ...state,
                checkArrayAssetNumber: [...action.checkArrayAssetNumber.content],
                isLoading: false
            };
        case AssetConstants.CHECK_ARRAY_ASSETNUMBER_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        default:
            return state
    }
}