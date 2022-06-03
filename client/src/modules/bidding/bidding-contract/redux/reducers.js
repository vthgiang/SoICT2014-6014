import {
    BiddingContractConstant
} from './constants';

const initState = {
    isLoading: false,
    totalList: 0,
    listBiddingContract: [],
    error: '',
}

export function biddingContract(state = initState, action) {
    switch (action.type) {
        case BiddingContractConstant.GET_BIDDING_CONTRACT_REQUEST:
        case BiddingContractConstant.CREATE_BIDDING_CONTRACT_REQUEST:
        case BiddingContractConstant.DELETE_BIDDING_CONTRACT_REQUEST:
        case BiddingContractConstant.UPDATE_BIDDING_CONTRACT_REQUEST:
        case BiddingContractConstant.CREATE_PROJECT_BY_BIDDING_CONTRACT_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case BiddingContractConstant.GET_BIDDING_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingContract: action.payload !== undefined ? action.payload : [],
                totalList: action.payload.totalList,
            };
        case BiddingContractConstant.CREATE_BIDDING_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingContract: action.payload !== undefined ? action.payload : [],
                totalList: action.payload.totalList,
            };
        case BiddingContractConstant.DELETE_BIDDING_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingContract: action.payload !== undefined ? action.payload : [],
                totalList: action.payload.totalList,
            };
        case BiddingContractConstant.CREATE_PROJECT_BY_BIDDING_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingContract: action.payload !== undefined ? action.payload : [],
                totalList: action.payload.totalList,
            };
        case BiddingContractConstant.UPDATE_BIDDING_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBiddingContract: action.payload !== undefined ? action.payload : [],
            };
        case BiddingContractConstant.GET_BIDDING_CONTRACT_FAILURE:
        case BiddingContractConstant.CREATE_BIDDING_CONTRACT_FAILURE:
        case BiddingContractConstant.DELETE_BIDDING_CONTRACT_FAILURE:
        case BiddingContractConstant.UPDATE_BIDDING_CONTRACT_FAILURE:
        case BiddingContractConstant.CREATE_PROJECT_BY_BIDDING_CONTRACT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state;
    }
}