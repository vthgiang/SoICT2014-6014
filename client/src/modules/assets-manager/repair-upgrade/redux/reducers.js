import { RepairUpgradeConstants } from './constants';
const initState = {
    isLoading: false,
    listRepairUpgrades: [],
    totalList: "",
    error:"",
}
export function repairUpgrade(state =initState, action) {
    switch (action.type) {
        case RepairUpgradeConstants.GET_REPAIR_UPGRADE_REQUEST:
        case RepairUpgradeConstants.CREATE_REPAIR_UPGRADE_REQUEST:
        case RepairUpgradeConstants.DELETE_REPAIR_UPGRADE_REQUEST:
        case RepairUpgradeConstants.UPDATE_REPAIR_UPGRADE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case RepairUpgradeConstants.GET_REPAIR_UPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRepairUpgrades: action.payload.listRepairUpgrades,
                totalList: action.payload.totalList,   
            };
        case RepairUpgradeConstants.CREATE_REPAIR_UPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRepairUpgrades: [...state.listRepairUpgrades, action.payload],
            };
        case RepairUpgradeConstants.DELETE_REPAIR_UPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRepairUpgrades: state.listRepairUpgrades.filter(repairUpgrade => (repairUpgrade._id !== action.payload._id)),
            };
        case RepairUpgradeConstants.UPDATE_REPAIR_UPGRADE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRepairUpgrades: state.listRepairUpgrades.map(repairUpgrade =>repairUpgrade._id === action.payload._id ?action.payload : repairUpgrade),
            };
        case RepairUpgradeConstants.GET_REPAIR_UPGRADE_FAILURE:
        case RepairUpgradeConstants.CREATE_REPAIR_UPGRADE_FAILURE:
        case RepairUpgradeConstants.DELETE_REPAIR_UPGRADE_FAILURE:
        case RepairUpgradeConstants.UPDATE_REPAIR_UPGRADE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}