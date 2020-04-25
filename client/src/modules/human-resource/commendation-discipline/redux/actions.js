import { DisciplineConstants } from "./constants";
import { DisciplineService } from "./services";
import { AlertActions } from "../../../alert/redux/actions";
export const DisciplineActions = {
    getListDiscipline,
    createNewDiscipline,
    deleteDiscipline,
    updateDiscipline,

    getListPraise,
    createNewPraise,
    deletePraise,
    updatePraise,
};
/**
 * Start
 * Quản lý kỷ luật
 * 
 */

// Lấy danh sách kỷ luật
function getListDiscipline(data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.GET_DISCIPLINE_REQUEST
        });
        DisciplineService.getListDiscipline(data)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.GET_DISCIPLINE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.GET_DISCIPLINE_FAILURE,
                    error: err.response.data
                });
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

// Tạo mới thông tin kỷ luật của nhân viên
function createNewDiscipline(data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.CREATE_DISCIPLINE_REQUEST
        });
        return new Promise((resolve, reject) => {
            DisciplineService.createNewDiscipline(data)
                .then(res => {
                    dispatch({
                        type: DisciplineConstants.CREATE_DISCIPLINE_SUCCESS,
                        payload: res.data.content
                    })
                    resolve(res);
                })
                .catch(err => {
                    dispatch({
                        type: DisciplineConstants.CREATE_DISCIPLINE_FAILURE,
                        error: err.response.data
                    });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                })
        })
    }
}

// Xoá thông tin kỷ luật của nhân viên
function deleteDiscipline(id) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.DELETE_DISCIPLINE_REQUEST
        });
        return new Promise((resolve, reject) => {
            DisciplineService.deleteDiscipline(id)
                .then(res => {
                    dispatch({
                        type: DisciplineConstants.DELETE_DISCIPLINE_SUCCESS,
                        payload: res.data.content
                    })
                    resolve(res);
                })
                .catch(err => {
                    dispatch({
                        type: DisciplineConstants.DELETE_DISCIPLINE_FAILURE,
                        error: err.response.data
                    });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                })
        })
    }
}

// cập nhật thông tin kỷ luật của nhân viên
function updateDiscipline(id, data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.UPDATE_DISCIPLINE_REQUEST
        });
        return new Promise((resolve, reject) => {
            DisciplineService.updateDiscipline(id, data)
                .then(res => {
                    dispatch({
                        type: DisciplineConstants.UPDATE_DISCIPLINE_SUCCESS,
                        payload: res.data.content
                    })
                    resolve(res);
                })
                .catch(err => {
                    dispatch({
                        type: DisciplineConstants.UPDATE_DISCIPLINE_FAILURE,
                        error: err.response.data
                    });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                })
        })
    }
}
/**
 * End
 * Quản lý kỷ luật
 * 
 */



/**
 * Start
 * Quản lý khen thưởng
 * 
 */

// Lấy danh sách khen thưởng
function getListPraise(data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.GET_PRAISE_REQUEST
        });
        DisciplineService.getListPraise(data)
            .then(res => {
                dispatch({
                    type: DisciplineConstants.GET_PRAISE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: DisciplineConstants.GET_PRAISE_FAILURE,
                    error: err.response.data
                });
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

// Thêm mới thông tin khen thưởng
function createNewPraise(data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.CREATE_PRAISE_REQUEST
        });
        return new Promise((resolve, reject) => {
            DisciplineService.createNewPraise(data)
                .then(res => {
                    dispatch({
                        type: DisciplineConstants.CREATE_PRAISE_SUCCESS,
                        payload: res.data.content
                    })
                    resolve(res);
                })
                .catch(err => {
                    dispatch({
                        type: DisciplineConstants.CREATE_PRAISE_FAILURE,
                        error: err.response.data
                    });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                })
        })
    }
}

// Xoá một chương trình đào tạo
function deletePraise(id) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.DELETE_PRAISE_REQUEST
        });
        return new Promise((resolve, reject) => {
            DisciplineService.deletePraise(id)
                .then(res => {
                    dispatch({
                        type: DisciplineConstants.DELETE_PRAISE_SUCCESS,
                        payload: res.data.content
                    })
                    resolve(res);
                })
                .catch(err => {
                    dispatch({
                        type: DisciplineConstants.DELETE_PRAISE_FAILURE,
                        error: err.response.data
                    });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                })
        })
    }
}

// cập nhật thông tin của chương trình đào tạo
function updatePraise(id, data) {
    return dispatch => {
        dispatch({
            type: DisciplineConstants.UPDATE_PRAISE_REQUEST
        });

        return new Promise((resolve, reject) => {
            DisciplineService.updatePraise(id, data)
                .then(res => {
                    dispatch({
                        type: DisciplineConstants.UPDATE_PRAISE_SUCCESS,
                        payload: res.data.content
                    })
                    resolve(res);
                })
                .catch(err => {
                    dispatch({
                        type: DisciplineConstants.UPDATE_PRAISE_FAILURE,
                        error: err.response.data
                    });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                })
        })
    }
}
/**
 * End
 * Quản lý khen thưởng
 * 
 */