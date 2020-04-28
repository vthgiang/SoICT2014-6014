import { RepairUpgradeConstants } from "./constants";
import { RepairUpgradeService } from "./services";
export const RepairUpgradeActions = {
    searchRepairUpgrades,
    createNewRepairUpgrade,
    deleteRepairUpgrade,
    updateRepairUpgrade,
};

// Lấy danh sách sửa chữa - thay thế - nâng cấp
function searchRepairUpgrades(data) {
    return dispatch => {
        dispatch({
            type: RepairUpgradeConstants.GET_REPAIR_UPGRADE_REQUEST
        });
        RepairUpgradeService.searchRepairUpgrades(data)
            .then(res => {
                dispatch({
                    type: RepairUpgradeConstants.GET_REPAIR_UPGRADE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RepairUpgradeConstants.GET_REPAIR_UPGRADE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Tạo mới thông tin sửa chữa - thay thế - nâng cấp
function createNewRepairUpgrade(data) {
    return dispatch => {
        dispatch({
            type: RepairUpgradeConstants.CREATE_REPAIR_UPGRADE_REQUEST
        });
        RepairUpgradeService.createNewRepairUpgrade(data)
            .then(res => {
                dispatch({
                    type: RepairUpgradeConstants.CREATE_REPAIR_UPGRADE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RepairUpgradeConstants.CREATE_REPAIR_UPGRADE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Xoá thông tin sửa chữa - thay thế - nâng cấp của tài sản
function deleteRepairUpgrade(id) {
    return dispatch => {
        dispatch({
            type: RepairUpgradeConstants.DELETE_REPAIR_UPGRADE_REQUEST,
        });
        RepairUpgradeService.deleteRepairUpgrade(id)
            .then(res => {
                dispatch({
                    type: RepairUpgradeConstants.DELETE_REPAIR_UPGRADE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RepairUpgradeConstants.DELETE_REPAIR_UPGRADE_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin sửa chữa - thay thế - nâng cấp của tài sản
function updateRepairUpgrade(id, infoRepairUpgrade) {
    return dispatch => {
        dispatch({
            type: RepairUpgradeConstants.UPDATE_REPAIR_UPGRADE_REQUEST
        });
        RepairUpgradeService.updateRepairUpgrade(id, infoRepairUpgrade)
            .then(res => {
                dispatch({
                    type: RepairUpgradeConstants.UPDATE_REPAIR_UPGRADE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RepairUpgradeConstants.UPDATE_REPAIR_UPGRADE_FAILURE,
                    error: err.response.data
                });
            })
    }
}