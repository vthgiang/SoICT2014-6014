import { AssetConstants } from './constants';
const initState = {
    isLoading: false,
    listAsset: [],
    totalList: "",
    error:"",
}
export function asset(state =initState, action) {
    switch (action.type) {
        case AssetConstants.GET_SABBATICAL_REQUEST:
        case AssetConstants.CREATE_SABBATICAL_REQUEST:
        case AssetConstants.DELETE_SABBATICAL_REQUEST:
        case AssetConstants.UPDATE_SABBATICAL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case AssetConstants.GET_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAsset: action.payload.listAsset,
                totalList: action.payload.totalList,   
            };
        case AssetConstants.CREATE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAsset: [...state.listAsset, action.payload],
            };
        case AssetConstants.DELETE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAsset: state.listAsset.filter(asset => (asset._id !== action.payload._id)),
            };
        case AssetConstants.UPDATE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAsset: state.listAsset.map(asset =>asset._id === action.payload._id ?action.payload : asset),
            };
        case AssetConstants.GET_SABBATICAL_FAILURE:
        case AssetConstants.CREATE_SABBATICAL_FAILURE:
        case AssetConstants.DELETE_SABBATICAL_FAILURE:
        case AssetConstants.UPDATE_SABBATICAL_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}