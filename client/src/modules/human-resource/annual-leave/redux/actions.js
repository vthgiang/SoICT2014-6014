import { SabbaticalConstants } from "./constants";
import { SabbaticalService } from "./services";
export const SabbaticalActions = {
    getListSabbatical,
    createNewSabbatical,
    deleteSabbatical,
    updateSabbatical,
};

// Lấy danh sách nghỉ phép
function getListSabbatical(data) {
    return dispatch => {
        dispatch({
            type: SabbaticalConstants.GET_SABBATICAL_REQUEST
        });
        SabbaticalService.getListSabbatical(data)
            .then(res => {
                dispatch({
                    type: SabbaticalConstants.GET_SABBATICAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SabbaticalConstants.GET_SABBATICAL_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Tạo mới thông tin nghỉ phép
function createNewSabbatical(data) {
    return dispatch => {
        dispatch({
            type: SabbaticalConstants.CREATE_SABBATICAL_REQUEST
        });
        SabbaticalService.createNewSabbatical(data)
            .then(res => {
                dispatch({
                    type: SabbaticalConstants.CREATE_SABBATICAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SabbaticalConstants.CREATE_SABBATICAL_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Xoá thông tin nghỉ phép của nhân viên
function deleteSabbatical(id) {
    return dispatch => {
        dispatch({
            type: SabbaticalConstants.DELETE_SABBATICAL_REQUEST,
        });
        SabbaticalService.deleteSabbatical(id)
            .then(res => {
                dispatch({
                    type: SabbaticalConstants.DELETE_SABBATICAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SabbaticalConstants.DELETE_SABBATICAL_SUCCESS,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin nghỉ phép của nhân viên
function updateSabbatical(id, infoSabbatical) {
    return dispatch => {
        dispatch({
            type: SabbaticalConstants.UPDATE_SABBATICAL_REQUEST
        });
        SabbaticalService.updateSabbatical(id, infoSabbatical)
            .then(res => {
                dispatch({
                    type: SabbaticalConstants.UPDATE_SABBATICAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SabbaticalConstants.UPDATE_SABBATICAL_FAILURE,
                    error: err.response.data
                });
            });
    }
}