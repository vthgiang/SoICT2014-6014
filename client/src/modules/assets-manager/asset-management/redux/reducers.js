import {
    AssetConstants
} from './constants';
const initState = {
    isLoading: false,
    totalList: '',
    totalAllAsset:'',

    listAssets: [],
    listAllAssets: [],
    error: '',
}
export function assetsManager(state = initState, action) {
    switch (action.type) {
        case AssetConstants.GETALL_REQUEST:
        case AssetConstants.ADDASSET_REQUEST:
        case AssetConstants.UPDATE_INFOR_ASSET_REQUEST:
        case AssetConstants.DELETE_ASSET_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.GETALL_SUCCESS:
            if (action.payload.totalList !== undefined) {
                return {
                    ...state,
                    listAssets: action.payload.data,
                    totalList: action.payload.totalList,
                    isLoading: false
                };
                
            } else {
                return {
                    ...state,
                    
                    totalAllAsset: action.payload.totalAllAsset !== undefined ? 
                        action.payload.totalAllAsset : state.totalAllAsset,

                    listAllAssets: action.payload.listAllAssets !== undefined ? 
                        action.payload.listAllAssets : state.listAllAssets ,
                    
                    isLoading: false
                }
            }

            case AssetConstants.ADDASSET_SUCCESS:
                return {
                    ...state,
                    listAssets: [...state.listAssets, action.payload],
                        isLoading: false
                };
            case AssetConstants.ADDASSET_FAILURE:
                return {
                    error: action.error,
                        isLoading: false,
                };
            case AssetConstants.UPDATE_INFOR_ASSET_SUCCESS:
                console.log(action.payload);
                return {
                    ...state,
                    listAssets: state.listAssets.map(x => x.assets[0]._id === action.payload.assets[0]._id ? action.payload : x),
                        isLoading: false
                };
            case AssetConstants.DELETE_ASSET_SUCCESS:
                return {
                    ...state,
                    listAssets: state.listAssets.filter(x => (x.assets[0]._id !== action.payload._id)),
                        isLoading: false,
                };

            case AssetConstants.GETALL_FAILURE:
            case AssetConstants.ADDASSET_FAILURE:
            case AssetConstants.UPDATE_INFOR_ASSET_FAILURE:
            case AssetConstants.DELETE_ASSET_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                        error: action.error
                };
            default:
                return state
    }
}