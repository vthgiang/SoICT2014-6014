import {
    BiddingPackageConstant
} from './constants';

const initState = {
    isLoading: false,
    totalList: 0,
    listBiddingPackage: [],
    error: '',
}

export function biddingPackage(state = initState, action) {
    switch (action.type) {
        case BiddingPackageConstant.GET_BIDDING_PACKAGE_REQUEST:
        case BiddingPackageConstant.CREATE_BIDDING_PACKAGE_REQUEST:
        case BiddingPackageConstant.DELETE_BIDDING_PACKAGE_REQUEST:
        case BiddingPackageConstant.UPDATE_BIDDING_PACKAGE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case BiddingPackageConstant.GET_BIDDING_PACKAGE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingPackage: action.payload !== undefined ? action.payload : [],
                totalList: action.payload.totalList,
            };
        
        case BiddingPackageConstant.CREATE_BIDDING_PACKAGE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingPackage: action.payload,
            };
        
        case BiddingPackageConstant.UPDATE_BIDDING_PACKAGE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingPackage: action.payload,
            };
        
        case BiddingPackageConstant.DELETE_BIDDING_PACKAGE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingPackage: action.payload,
            };


        case BiddingPackageConstant.GET_BIDDING_PACKAGE_FAILURE:
        case BiddingPackageConstant.CREATE_BIDDING_PACKAGE_FAILURE:
        case BiddingPackageConstant.DELETE_BIDDING_PACKAGE_FAILURE:
        case BiddingPackageConstant.UPDATE_BIDDING_PACKAGE_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state;
    }
}