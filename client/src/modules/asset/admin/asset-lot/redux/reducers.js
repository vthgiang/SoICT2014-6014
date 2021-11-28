import { AssetLotConstants } from './constants';

const initState = {
    isLoading: false,
    totalList: '',
    listAssetLots: [],
    error: '',
}

export function assetLotManager(state = initState, action) {
    switch (action.type) {
        case AssetLotConstants.GETALL_REQUEST:
        case AssetLotConstants.GETALL_SUCCESS:
            if (action.payload.totalList !== undefined) {
                return {
                    ...state,
                    listAssetLots: action.payload.data,
                    totalList: action.payload.totalList,
                    isLoading: false
                };

            } else {
                return state
            }
        case AssetLotConstants.GETALL_FAILURE:
        default:
            return state
    }
}
