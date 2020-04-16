import { RepairUpgradeConstants } from './constants';
const initState = {
    isLoading: false,
    listRepairUpgrade: [],
    totalList: "",
    error:"",
}
export function repairUpgrade(state =initState, action) {
    switch (action.type) {
        case RepairUpgradeConstants.GET_REPAIRUPGRADE_REQUEST:
        case RepairUpgradeConstants.CREATE_REPAIRUPGRADE_REQUEST:
        case RepairUpgradeConstants.DELETE_REPAIRUPGRADE_REQUEST:
        case RepairUpgradeConstants.UPDATE_REPAIRUPGRADE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case RepairUpgradeConstants.GET_REPAIRUPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRepairUpgrade: action.payload.listRepairUpgrade,
                totalList: action.payload.totalList,   
            };
        case RepairUpgradeConstants.CREATE_REPAIRUPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRepairUpgrade: [...state.listRepairUpgrade, action.payload],
            };
        case RepairUpgradeConstants.DELETE_REPAIRUPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRepairUpgrade: state.listRepairUpgrade.filter(repairUpgrade => (repairUpgrade._id !== action.payload._id)),
            };
        case RepairUpgradeConstants.UPDATE_REPAIRUPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRepairUpgrade: state.listRepairUpgrade.map(repairUpgrade =>repairUpgrade._id === action.payload._id ?action.payload : repairUpgrade),
            };
        case RepairUpgradeConstants.GET_REPAIRUPGRADE_FAILURE:
        case RepairUpgradeConstants.CREATE_REPAIRUPGRADE_FAILURE:
        case RepairUpgradeConstants.DELETE_REPAIRUPGRADE_FAILURE:
        case RepairUpgradeConstants.UPDATE_REPAIRUPGRADE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}