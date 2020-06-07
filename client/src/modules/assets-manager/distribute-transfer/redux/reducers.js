import { DistributeTransferConstants } from './constants';
const initState = {
    isLoading: false,
    listDistributeTransfers: [],
    totalList: "",
    error: "",
}
export function distributeTransfer(state = initState, action) {
    switch (action.type) {
        case DistributeTransferConstants.GET_DISTRIBUTE_TRANSFER_REQUEST:
        case DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_REQUEST:
        case DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_REQUEST:
        case DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DistributeTransferConstants.GET_DISTRIBUTE_TRANSFER_SUCCESS:
            // console.log(action);
            return {
                ...state,
                isLoading: false,
                listDistributeTransfers: action.payload.listDistributeTransfers,
                totalList: action.payload.totalList,
            };
        case DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDistributeTransfers: [...state.listDistributeTransfers, action.payload],
            };
        case DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_SUCCESS:

            return {
                ...state,
                isLoading: false,
                listDistributeTransfers: state.listDistributeTransfers.filter(distributeTransfer => (distributeTransfer._id !== action.payload._id)),
            };
        case DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDistributeTransfers: state.listDistributeTransfers.map(distributeTransfer => distributeTransfer._id === action.payload._id ? action.payload : distributeTransfer),
            };
        case DistributeTransferConstants.GET_DISTRIBUTE_TRANSFER_FAILURE:
        case DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_FAILURE:
        case DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_FAILURE:
        case DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}
