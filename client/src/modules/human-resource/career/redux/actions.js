import {
    CareerConstant
} from "./constants";

import {
    CareerService
} from "./services";

export const CareerReduxAction = {
    getListCareerPosition,
    createCareerPosition,
    editCareerPosition,
    deleteCareerPosition,
};


// ===============GET===================

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
                    payload: res.data.content.listPosition
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

// ==================CREATE====================

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
                    payload: res.data.content.listPosition
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


// ==============EDIT===================

/**
 * Chỉnh sửa vị trí công việc
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
                    payload: res.data.content.listPosition
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

/**
 * Xóa vị trí
 * @data : Dữ liệu key tìm kiếm 
 */
function deleteCareerPosition(data) {
    return dispatch => {
        dispatch({
            type: CareerConstant.DELETE_CAREER_POSITION_REQUEST,
        });
        CareerService.deleteCareerPosition(data)
            .then(res => {
                dispatch({
                    type: CareerConstant.DELETE_CAREER_POSITION_SUCCESS,
                    payload: res.data.content.listPosition
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerConstant.DELETE_CAREER_POSITION_FAILURE,
                    error: err
                });
            })
    }
}