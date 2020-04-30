import { AnnualLeaveConstants } from "./constants";
import { AnnualLeaveService } from "./services";
export const AnnualLeaveActions = {
    searchAnnualLeaves,
    createAnnualLeave,
    deleteAnnualLeave,
    updateAnnualLeave,
};

// Lấy danh sách nghỉ phép
function searchAnnualLeaves(data) {
    return dispatch => {
        dispatch({
            type: AnnualLeaveConstants.GET_ANNUAL_LEAVE_REQUEST
        });
        AnnualLeaveService.searchAnnualLeaves(data)
            .then(res => {
                dispatch({
                    type: AnnualLeaveConstants.GET_ANNUAL_LEAVE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AnnualLeaveConstants.GET_ANNUAL_LEAVE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Tạo mới thông tin nghỉ phép
function createAnnualLeave(data) {
    return dispatch => {
        dispatch({
            type: AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_REQUEST
        });
        AnnualLeaveService.createAnnualLeave(data)
            .then(res => {
                dispatch({
                    type: AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Xoá thông tin nghỉ phép của nhân viên
function deleteAnnualLeave(id) {
    return dispatch => {
        dispatch({
            type: AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_REQUEST,
        });
        AnnualLeaveService.deleteAnnualLeave(id)
            .then(res => {
                dispatch({
                    type: AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin nghỉ phép của nhân viên
function updateAnnualLeave(id, infoSabbatical) {
    return dispatch => {
        dispatch({
            type: AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_REQUEST
        });
        AnnualLeaveService.updateAnnualLeave(id, infoSabbatical)
            .then(res => {
                dispatch({
                    type: AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_FAILURE,
                    error: err.response.data
                });
            })
    }
}