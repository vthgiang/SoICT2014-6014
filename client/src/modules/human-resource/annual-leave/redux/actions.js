import {
    AnnualLeaveConstants
} from "./constants";
import {
    AnnualLeaveService
} from "./services";
export const AnnualLeaveActions = {
    searchAnnualLeaves,
    createAnnualLeave,
    deleteAnnualLeave,
    updateAnnualLeave,
    importAnnualLeave,
    requestToChangeAnnuaLeave,
};

/**
 * Lấy danh sách nghỉ phép
 * @data : Dữ liệu key tìm kiếm
 */
function searchAnnualLeaves(data) {
    return dispatch => {
        dispatch({
            type: AnnualLeaveConstants.GET_ANNUAL_LEAVE_REQUEST,
            beforAndAfterOneWeek: data.beforAndAfterOneWeek
        });
        AnnualLeaveService.searchAnnualLeaves(data)
            .then(res => {
                dispatch({
                    type: AnnualLeaveConstants.GET_ANNUAL_LEAVE_SUCCESS,
                    payload: res.data.content,
                    beforAndAfterOneWeek: data.beforAndAfterOneWeek,
                })
            })
            .catch(err => {
                dispatch({
                    type: AnnualLeaveConstants.GET_ANNUAL_LEAVE_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Tạo mới thông tin nghỉ phép
 * @data : Dữ liệu tạo mới thông tin nghỉ phép
 */
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
                    error: err
                });
            })
    }
}

/**
 * Xoá thông tin nghỉ phép
 * @id : Id nghỉ phép cần xoá
 */
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
                    error: err
                });
            })
    }
}

/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép cần cập nhật 
 * @data  : Dữ liệu cập nhật nghỉ phép
 */
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
                    error: err
                });
            })
    }
}

/**
 * Import dữ liệu nghỉ phép
 * @param {*} data : Array thông tin nghỉ phép
 */
function importAnnualLeave(data) {
    return dispatch => {
        dispatch({
            type: AnnualLeaveConstants.IMPORT_ANNUAL_LEAVE_REQUEST
        });
        AnnualLeaveService.importAnnualLeave(data)
            .then(res => {
                dispatch({
                    type: AnnualLeaveConstants.IMPORT_ANNUAL_LEAVE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                dispatch({
                    type: AnnualLeaveConstants.IMPORT_ANNUAL_LEAVE_FAILURE,
                    error: err.response.data.content
                });
            })
    };
}


function requestToChangeAnnuaLeave(id, data) {
    return dispatch => {
        dispatch({
            type: AnnualLeaveConstants.REQUEST_TO_CHANGE_ANNUALEAVE_REQUEST
        });
        AnnualLeaveService.requestToChangeAnnuaLeave(id, data)
            .then(res => {
                dispatch({
                    type: AnnualLeaveConstants.REQUEST_TO_CHANGE_ANNUALEAVE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                dispatch({
                    type: AnnualLeaveConstants.REQUEST_TO_CHANGE_ANNUALEAVE_FAILURE,
                    error: err
                });
            })
    };
}