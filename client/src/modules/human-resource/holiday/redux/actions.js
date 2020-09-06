import {
    HolidayConstants
} from "./constants";

import {
    HolidayService
} from "./services";

export const HolidayActions = {
    getListHoliday,
    createNewHoliday,
    deleteHoliday,
    updateHoliday,
    importHoliday,
};

/**
 * Lấy danh sách lịch làm việc
 */
function getListHoliday(data) {
    return dispatch => {
        dispatch({
            type: HolidayConstants.GET_HOLIDAY_REQUEST
        });
        HolidayService.getListHoliday(data)
            .then(res => {
                dispatch({
                    type: HolidayConstants.GET_HOLIDAY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: HolidayConstants.GET_HOLIDAY_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Thêm mới thông tin lịch làm việc
 * @param {*} data : Dữ liệu thông tin lịch làm việc
 */
function createNewHoliday(data) {
    return dispatch => {
        dispatch({
            type: HolidayConstants.CREATE_HOLIDAY_REQUEST
        });
        HolidayService.createNewHoliday(data)
            .then(res => {
                dispatch({
                    type: HolidayConstants.CREATE_HOLIDAY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: HolidayConstants.CREATE_HOLIDAY_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Xoá thông tin lịch làm việc
 * @param {*} id : Id thông tin lịch làm việc cần xoá
 */
function deleteHoliday(id) {
    return dispatch => {
        dispatch({
            type: HolidayConstants.DELETE_HOLIDAY_REQUEST,
        });

        HolidayService.deleteHoliday(id)
            .then(res => {
                dispatch({
                    type: HolidayConstants.DELETE_HOLIDAY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: HolidayConstants.DELETE_HOLIDAY_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Chỉnh sửa thông tin lịch làm việc
 * @param {*} id : id thông tin lịch làm việc cần chỉnh sửa
 * @param {*} data : dữ liệu chỉnh sửa thông tin lịch làm việc
 */
function updateHoliday(id, infoHoliday) {
    return dispatch => {
        dispatch({
            type: HolidayConstants.UPDATE_HOLIDAY_REQUEST,
        });

        HolidayService.updateHoliday(id, infoHoliday)
            .then(res => {
                dispatch({
                    type: HolidayConstants.UPDATE_HOLIDAY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: HolidayConstants.UPDATE_HOLIDAY_FAILURE,
                    error: err
                });
            })
    }
}

/**
 * Import dữ liệu lịch làm việc
 * @param {*} data : Array thông tin lịch làm việc
 */
function importHoliday(data) {
    return dispatch => {
        dispatch({
            type: HolidayConstants.IMPORT_HOLIDAY_REQUEST
        });
        HolidayService.importHoliday(data)
            .then(res => {
                dispatch({
                    type: HolidayConstants.IMPORT_HOLIDAY_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                dispatch({
                    type: HolidayConstants.IMPORT_HOLIDAY_FAILURE,
                    error: err.response.data.content
                });
            })
    };
}