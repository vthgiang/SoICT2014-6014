import { RepairUpgradeConstants } from "./constants";
import { RepairUpgradeService } from "./services";
import { AssetManagerActions } from "../../asset-manager/redux/actions";
export const RepairUpgradeActions = {
    searchRepairUpgrades,
    createNewRepairUpgrade,
    deleteRepairUpgrade,
    updateRepairUpgrade,
};

// lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
function searchRepairUpgrades(data) {

    return async dispatch => {
        try {
            const result = await RepairUpgradeService.searchRepairUpgrades(data);

            dispatch({
                type: RepairUpgradeConstants.GET_REPAIR_UPGRADE_SUCCESS,
                payload: result.data.content
            })

        } catch (error) {
            dispatch({
                type: RepairUpgradeConstants.GET_REPAIR_UPGRADE_FAILURE,
                error: error.response.data
            });
        }
    }
}

// Tạo mới thông tin phiếu sửa chữa - thay thế - nâng cấp
function createNewRepairUpgrade(data) {
    return dispatch => {

        dispatch({
            type: RepairUpgradeConstants.CREATE_REPAIR_UPGRADE_REQUEST
        });
        RepairUpgradeService.createNewRepairUpgrade(data)
            .then(res => {
                dispatch(AssetManagerActions.getAllAsset({
                    code: "",
                    assetName: "",
                    assetType: null,
                    month: "",
                    status: null,
                    page: 0,
                    limit: 5,
                }));
                dispatch(searchRepairUpgrades({
                    repairNumber: "",
                    code: "",
                    month: "",
                    type: null,
                    status: null,
                    page: 0,
                    limit: 5,
                }));
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

// Xoá thông tin thông tin phiếu sửa chữa - thay thế - nâng cấp
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

// cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp
function updateRepairUpgrade(id, infoRepairUpgrade) {
    return dispatch => {
        dispatch({
            type: RepairUpgradeConstants.UPDATE_REPAIR_UPGRADE_REQUEST
        });
        RepairUpgradeService.updateRepairUpgrade(id, infoRepairUpgrade)
            .then(res => {
                dispatch(AssetManagerActions.getAllAsset({
                    code: "",
                    assetName: "",
                    assetType: null,
                    month: "",
                    status: null,
                    page: 0,
                    limit: 5
                }));
                dispatch(searchRepairUpgrades({
                    repairNumber: "",
                    code: "",
                    month: "",
                    type: null,
                    status: null,
                    page: 0,
                    limit: 5,
                }))
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
