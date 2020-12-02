import {
    MajorConstant
} from "./constants";

import {
    MajorService
} from "./services";

export const MajorActions = {
    getListMajor,
    createMajor,
};

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListMajor(data) {
    return dispatch => {
        dispatch({
            type: MajorConstant.GET_MAJOR_REQUEST
        });
        MajorService.getListMajor(data)
            .then(res => {
                dispatch({
                    type: MajorConstant.GET_MAJOR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: MajorConstant.GET_MAJOR_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function createMajor(data) {
    return dispatch => {
        dispatch({
            type: MajorConstant.CREATE_MAJOR_REQUEST
        });
        MajorService.createMajor(data)
            .then(res => {
                dispatch({
                    type: MajorConstant.CREATE_MAJOR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: MajorConstant.CREATE_MAJOR_FAILURE,
                    error: err
                });
            })
    }
}
