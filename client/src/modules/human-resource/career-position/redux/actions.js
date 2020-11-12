import {
    CareerPositionConstant
} from "./constants";

import {
    CareerPositionService
} from "./services";

export const CareerPositionAction = {
    getListCareerPosition,
    getListCareerField,
    getListCareerAction,
};

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCareerPosition(data) {
    return dispatch => {
        dispatch({
            type: CareerPositionConstant.GET_CAREER_POSITION_REQUEST
        });
        CareerPositionService.getListCareerPosition(data)
            .then(res => {
                dispatch({
                    type: CareerPositionConstant.GET_CAREER_POSITION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerPositionConstant.GET_CAREER_POSITION_FAILURE,
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
            type: CareerPositionConstant.GET_CAREER_FIELD_REQUEST
        });
        CareerPositionService.getListCareerField(data)
            .then(res => {
                dispatch({
                    type: CareerPositionConstant.GET_CAREER_FIELD_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerPositionConstant.GET_CAREER_FIELD_FAILURE,
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
            type: CareerPositionConstant.GET_CAREER_ACTION_REQUEST
        });
        CareerPositionService.getListCareerAction(data)
            .then(res => {
                dispatch({
                    type: CareerPositionConstant.GET_CAREER_ACTION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CareerPositionConstant.GET_CAREER_ACTION_FAILURE,
                    error: err
                });
            })
    }
}
