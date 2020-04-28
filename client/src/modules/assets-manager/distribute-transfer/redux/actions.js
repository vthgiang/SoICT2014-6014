import { DistributeTransferConstants } from "./constants";
import { DistributeTransferService } from "./services";
export const DistributeTransferActions = {
    searchDistributeTransfers,
    createNewDistributeTransfer,
    deleteDistributeTransfer,
    updateDistributeTransfer,
};

// Lấy danh sách nghỉ phép
function searchDistributeTransfers(data) {
    return dispatch => {
        dispatch({
            type: DistributeTransferConstants.GET_DISTRIBUTE_TRANSFER_REQUEST
        });
        DistributeTransferService.searchDistributeTransfers(data)
            .then(res => {
                dispatch({
                    type: DistributeTransferConstants.GET_DISTRIBUTE_TRANSFER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DistributeTransferConstants.GET_DISTRIBUTE_TRANSFER_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Tạo mới thông tin nghỉ phép
function createNewDistributeTransfer(data) {
    return dispatch => {
        dispatch({
            type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_REQUEST
        });
        DistributeTransferService.createNewDistributeTransfer(data)
            .then(res => {
                dispatch({
                    type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DistributeTransferConstants.CREATE_DISTRIBUTE_TRANSFER_FAILURE,
                    error: err.response.data
                });
            })
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
    return dispatch => {
        dispatch({
            type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_REQUEST
        });
        DistributeTransferService.updateDistributeTransfer(id, infoDistributeTransfer)
            .then(res => {
                dispatch({
                    type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DistributeTransferConstants.UPDATE_DISTRIBUTE_TRANSFER_FAILURE,
                    error: err.response.data
                });
            })
    }
}