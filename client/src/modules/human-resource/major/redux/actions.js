import {
    MajorConstant
} from "./constants";

import {
    MajorService
} from "./services";

export const MajorActions = {
    getListMajor,
    createMajor,
    deleteMajor,
    updateMajor,
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

/**
 * Xóa chuyên ngành
 * @data : danh sách id xóa
 */
function deleteMajor(data) {
    return dispatch => {
        dispatch({
            type: MajorConstant.DELETE_MAJOR_REQUEST
        });
        MajorService.deleteMajor(data)
            .then(res => {
                dispatch({
                    type: MajorConstant.DELETE_MAJOR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: MajorConstant.DELETE_MAJOR_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * cập nhật dữ liệu chuyên ngành
 * @data : Dữ liệu cập nhật
 */
function updateMajor(data) {
    return dispatch => {
        dispatch({
            type: MajorConstant.UPDATE_MAJOR_REQUEST
        });
        MajorService.updateMajor(data)
            .then(res => {
                dispatch({
                    type: MajorConstant.UPDATE_MAJOR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: MajorConstant.UPDATE_MAJOR_FAILURE,
                    error: err
                });
            })
    }
}
