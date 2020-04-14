import { BuyRequestConstants } from './constants';
const initState = {
    isLoading: false,
    listBuyRequest: [],
    totalList: "",
    error:"",
}
export function buyRequest(state =initState, action) {
    switch (action.type) {
        case BuyRequestConstants.GET_BUYREQUEST_REQUEST:
        case BuyRequestConstants.CREATE_BUYREQUEST_REQUEST:
        case BuyRequestConstants.DELETE_BUYREQUEST_REQUEST:
        case BuyRequestConstants.UPDATE_BUYREQUEST_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case BuyRequestConstants.GET_BUYREQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBuyRequest: action.payload.listBuyRequest,
                totalList: action.payload.totalList,   
            };
        case BuyRequestConstants.CREATE_BUYREQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBuyRequest: [...state.listBuyRequest, action.payload],
            };
        case BuyRequestConstants.DELETE_BUYREQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBuyRequest: state.listBuyRequest.filter(buyRequest => (buyRequest._id !== action.payload._id)),
            };
        case BuyRequestConstants.UPDATE_BUYREQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listBuyRequest: state.listBuyRequest.map(buyRequest =>buyRequest._id === action.payload._id ?action.payload : buyRequest),
            };
        case BuyRequestConstants.GET_BUYREQUEST_FAILURE:
        case BuyRequestConstants.CREATE_BUYREQUEST_FAILURE:
        case BuyRequestConstants.DELETE_BUYREQUEST_FAILURE:
        case BuyRequestConstants.UPDATE_BUYREQUEST_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}