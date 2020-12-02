import {
    CareerConstant
} from "./constants";

import {
    CareerService
} from "./services";

export const CareerReduxAction = {
    getListCareerPosition,
    getListCareerField,
    getListCareerAction,

    createCareerField,
    createCareerPosition,
    createCareerAction,
    
    editCareerPosition,
};

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCareerPosition(data) {
    return dispatch => {
        dispatch({
            type: CareerConstant.GET_CAREER_POSITION_REQUEST
        });
        CareerService.getListCareerPosition(data)
            .then(res => {
                dispatch({
                    type: CareerConstant.GET_CAREER_POSITION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerConstant.GET_CAREER_POSITION_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCareerField(data) {
    return dispatch => {
        dispatch({
            type: CareerConstant.GET_CAREER_FIELD_REQUEST
        });
        CareerService.getListCareerField(data)
            .then(res => {
                dispatch({
                    type: CareerConstant.GET_CAREER_FIELD_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerConstant.GET_CAREER_FIELD_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCareerAction(data) {
    return dispatch => {
        dispatch({
            type: CareerConstant.GET_CAREER_ACTION_REQUEST
        });
        CareerService.getListCareerAction(data)
            .then(res => {
                dispatch({
                    type: CareerConstant.GET_CAREER_ACTION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerConstant.GET_CAREER_ACTION_FAILURE,
                    error: err
                });
            })
    }
}



// ======================================

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function createCareerField(data) {
    return dispatch => {
        dispatch({
            type: CareerConstant.CREATE_CAREER_FIELD_REQUEST
        });
        CareerService.createCareerField(data)
            .then(res => {
                dispatch({
                    type: CareerConstant.CREATE_CAREER_FIELD_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerConstant.CREATE_CAREER_FIELD_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function createCareerPosition(data) {
    return dispatch => {
        dispatch({
            type: CareerConstant.CREATE_CAREER_POSITION_REQUEST
        });
        CareerService.createCareerPosition(data)
            .then(res => {
                dispatch({
                    type: CareerConstant.CREATE_CAREER_POSITION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerConstant.CREATE_CAREER_POSITION_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function createCareerAction(data) {
    return dispatch => {
        dispatch({
            type: CareerConstant.CREATE_CAREER_ACTION_REQUEST
        });
        CareerService.createCareerAction(data)
            .then(res => {
                dispatch({
                    type: CareerConstant.CREATE_CAREER_ACTION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerConstant.CREATE_CAREER_ACTION_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function editCareerPosition(data) {
    return dispatch => {
        dispatch({
            type: CareerConstant.UPDATE_CAREER_POSITION_REQUEST
        });
        CareerService.editCareerPosition(data)
            .then(res => {
                dispatch({
                    type: CareerConstant.UPDATE_CAREER_POSITION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerConstant.UPDATE_CAREER_POSITION_FAILURE,
                    error: err
                });
            })
    }
}
