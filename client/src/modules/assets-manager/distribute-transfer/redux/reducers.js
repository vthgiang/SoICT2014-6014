import { DistributeTransferConstants } from './constants';
const initState = {
    isLoading: false,
    listDistributeTransfer: [],
    totalList: "",
    error:"",
}
export function distributeTransfer(state =initState, action) {
    switch (action.type) {
        case DistributeTransferConstants.GET_REPAIRUPGRADE_REQUEST:
        case DistributeTransferConstants.CREATE_REPAIRUPGRADE_REQUEST:
        case DistributeTransferConstants.DELETE_REPAIRUPGRADE_REQUEST:
        case DistributeTransferConstants.UPDATE_REPAIRUPGRADE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case DistributeTransferConstants.GET_REPAIRUPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDistributeTransfer: action.payload.listDistributeTransfer,
                totalList: action.payload.totalList,   
            };
        case DistributeTransferConstants.CREATE_REPAIRUPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDistributeTransfer: [...state.listDistributeTransfer, action.payload],
            };
        case DistributeTransferConstants.DELETE_REPAIRUPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDistributeTransfer: state.listDistributeTransfer.filter(repairUpgrade => (repairUpgrade._id !== action.payload._id)),
            };
        case DistributeTransferConstants.UPDATE_REPAIRUPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDistributeTransfer: state.listDistributeTransfer.map(repairUpgrade =>repairUpgrade._id === action.payload._id ?action.payload : repairUpgrade),
            };
        case DistributeTransferConstants.GET_REPAIRUPGRADE_FAILURE:
        case DistributeTransferConstants.CREATE_REPAIRUPGRADE_FAILURE:
        case DistributeTransferConstants.DELETE_REPAIRUPGRADE_FAILURE:
        case DistributeTransferConstants.UPDATE_REPAIRUPGRADE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}