import { stat } from 'fs';
import { AssetLotConstants } from './constants';

const initState = {
    isLoading: false,
    totalList: 0,
    listAssetLots: [], // render table 
    error: '',
    listAssets: [],

}

export function assetLotManager(state = initState, action) {
    switch (action.type) {
        case AssetLotConstants.GETALL_REQUEST:
        case AssetLotConstants.GETALL_SUCCESS:
            if (action.payload !== undefined) {
                return {
                    ...state,
                    listAssetLots: action.payload.data,
                    totalList: action.payload.totalList,
                    isLoading: false
                };

            } else {
                return { ...state }
            }
        case AssetLotConstants.GETALL_FAILURE:

        case AssetLotConstants.CREATE_ASSETLOT_REQUEST:

        case AssetLotConstants.CREATE_ASSETLOT_SUCCESS:
            
            if (action.payload) {
                return {
                    ...state,
                    isLoading: false,
                    listAssetLots: [...action.payload.assetLot, ...state.listAssetLots]
                }
            } else {
                return { ...state, isLoading: false }
            }
        // console.log("hang reducer:",action.payload.assetLot);

        case AssetLotConstants.CREATE_ASSETLOT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error,
                assetLotCodeError: action.payload
            }

        case AssetLotConstants.UPDATE_ASSETLOT_REQUEST: break;
        case AssetLotConstants.UPDATE_ASSETLOT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAssetLots: [action.payload, ...state.listAssetLots]
            }
        case AssetLotConstants.UPDATE_ASSETLOT_FAILURE: break;

        case AssetLotConstants.DELETE_ASSETLOT_REQUEST:
            return {
                ...state,
                isLoading: true,
                assetLotCodeError: []
            }
        case AssetLotConstants.DELETE_ASSETLOT_SUCCESS:
            return {
                ...state,
                listAssetLots: state.listAssetLots.filter(assetLot => !action.assetLotIds.includes(assetLot?._id)),
                isLoading: false
            }
        case AssetLotConstants.DELETE_ASSETLOT_FAILURE:
        case AssetLotConstants.TEST_ACTION:
            return { ...state, listAssets: action.data }
        default:
            return state
    }
}
