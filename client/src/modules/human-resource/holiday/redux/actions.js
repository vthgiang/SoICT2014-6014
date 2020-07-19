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
 * Lấy danh sách lịch nghỉ lễ tết
 */
function getListHoliday() {
    return dispatch => {
        dispatch({
            type: HolidayConstants.GET_HOLIDAY_REQUEST
        });
        HolidayService.getListHoliday()
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
 * Thêm mới thông tin nghỉ lễ tết
 * @param {*} data : dữ liệu thông tin nghỉ lễ tết cần tạo
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
 * Xoá thông tin nghỉ lễ tết
 * @param {*} id :id thông tin nghỉ lễ tết cần xoá
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
 * Chỉnh sửa thông tin nghỉ lễ tết
 * @param {*} id : id thông tin nghỉ lễ tết cần chỉnh sửa
 * @param {*} data : dữ liệu chỉnh sửa thông tin nghỉ lễ têt
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
 * Import dữ liệu nghỉ lễ tết
 * @param {*} data : array thông tin nghỉ lễ tết
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