import {
    ContractConstant
} from './constants';

const initState = {
    isLoading: false,
    totalList: 0,
    listContract: [],
    error: '',
}

export function contract(state = initState, action) {
    switch (action.type) {
        case ContractConstant.GET_CONTRACT_REQUEST:
        case ContractConstant.CREATE_CONTRACT_REQUEST:
        case ContractConstant.DELETE_CONTRACT_REQUEST:
        case ContractConstant.UPDATE_CONTRACT_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case ContractConstant.GET_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listContract: action.payload !== undefined ? action.payload : [],
                totalList: action.payload.totalList,
            };
        case ContractConstant.CREATE_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listContract: action.payload!== undefined ? action.payload : [],
                totalList: action.payload.totalList,
            };
        case ContractConstant.DELETE_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listContract: action.payload!== undefined ? action.payload : [],
                totalList: action.payload.totalList,
            };
        case ContractConstant.UPDATE_CONTRACT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listContract: action.payload!== undefined ? action.payload : [],
            };
        case ContractConstant.GET_CONTRACT_FAILURE:
        case ContractConstant.CREATE_CONTRACT_FAILURE:
        case ContractConstant.DELETE_CONTRACT_FAILURE:
        case ContractConstant.UPDATE_CONTRACT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state;
    }
}