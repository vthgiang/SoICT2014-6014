import { DistributeTransferConstants } from "./constants";
import { DistributeTransferService } from "./services";
import { AssetManagerActions } from "../../asset-manager/redux/actions";

export const DistributeTransferActions = {
    searchDistributeTransfers,
    createNewDistributeTransfer,
    deleteDistributeTransfer,
    updateDistributeTransfer,
};

// Lấy danh sách cấp phát - điều chuyển - thu hồi
function searchDistributeTransfers(data) {

    return async (dispatch) => {
        try {
            const result = await DistributeTransferService.searchDistributeTransfers(data);

            dispatch({
                type: DistributeTransferConstants.GET_DISTRIBUTE_TRANSFER_SUCCESS,
                payload: result.data.content
            })

        } catch (error) {
            dispatch({
                type: DistributeTransferConstants.GET_DISTRIBUTE_TRANSFER_FAILURE,
                error: error.response.data
            });
        }
    };
}

// Tạo mới thông tin nghỉ phép
function createNewDistributeTransfer(data) {
    return async dispatch => {
        try {
            dispatch({
                type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_REQUEST
            });
            const response = await DistributeTransferService.createNewDistributeTransfer(data).then(res => res);
            dispatch(AssetManagerActions.getAllAsset({
                code: "",
                assetName: "",
                assetType: null,
                month: "",
                status: null,
                page: 0,
                limit: 5,
            }));
            dispatch(searchDistributeTransfers({
                distributeNumber: "",
                code: "",
                month: "",
                type: null,
                page: 0,
                limit: 5
            }));
            dispatch({
                type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_FAILURE,
                error: err.response.data
            });
        }

    }
}

// Xoá thông tin nghỉ phép của nhân viên
function deleteDistributeTransfer(id) {
    return dispatch => {
        dispatch({
            type: DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_REQUEST,
        });
        DistributeTransferService.deleteDistributeTransfer(id)
            .then(res => {
                dispatch({
                    type: DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DistributeTransferConstants.DELETE_DISTRIBUTE_TRANSFER_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin nghỉ phép của nhân viên
function updateDistributeTransfer(id, infoDistributeTransfer) {
    return async dispatch => {
        try {
            dispatch({
                type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_REQUEST
            });
            const response = await DistributeTransferService.updateDistributeTransfer(id, infoDistributeTransfer)
            dispatch(searchDistributeTransfers({
                distributeNumber: "",
                code: "",
                month: "",
                type: null,
                page: 0,
                limit: 5
            }));
            dispatch(AssetManagerActions.getAllAsset({
                code: "",
                assetName: "",
                assetType: null,
                month: "",
                status: null,
                page: 0,
                limit: 5
            }));
            dispatch({
                type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_SUCCESS,
                payload: response.data.content
            });
            return {
                response
            }
        } catch (err) {
            dispatch({
                type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_FAILURE,
                error: err.response.data
            });
        }
    }
}
