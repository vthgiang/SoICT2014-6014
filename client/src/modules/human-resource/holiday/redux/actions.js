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
};

// lấy danh sách kỷ luật
function getListHoliday(data) {
    return dispatch => {
        dispatch(request());

        HolidayService.getListHoliday(data)
            .then(
                listHoliday => dispatch(success(listHoliday)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: HolidayConstants.GET_HOLIDAY_REQUEST,
        };
    };

    function success(listHoliday) {
        return {
            type: HolidayConstants.GET_HOLIDAY_SUCCESS,
            listHoliday
        };
    };

    function failure(error) {
        return {
            type: HolidayConstants.GET_HOLIDAY_FAILURE,
            error
        };
    };
}

// tạo mới thông tin kỷ luật của nhân viên
function createNewHoliday(newHoliday) {
    return dispatch => {
        dispatch(request(newHoliday));

        HolidayService.createNewHoliday(newHoliday)
            .then(
                newHoliday => dispatch(success(newHoliday)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(newHoliday) {
        return {
            type: HolidayConstants.CREATE_HOLIDAY_REQUEST,
            newHoliday
        };
    };

    function success(newHoliday) {
        return {
            type: HolidayConstants.CREATE_HOLIDAY_SUCCESS,
            newHoliday
        };
    };

    function failure(error) {
        return {
            type: HolidayConstants.CREATE_HOLIDAY_FAILURE,
            error
        };
    };
}

// Xoá thông tin kỷ luật của nhân viên
function deleteHoliday(id) {
    return dispatch => {
        dispatch(request());

        HolidayService.deleteHoliday(id)
            .then(
                holidayDelete => dispatch(success(holidayDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: HolidayConstants.DELETE_HOLIDAY_REQUEST,
        };
    };

    function success(holidayDelete) {
        return {
            type: HolidayConstants.DELETE_HOLIDAY_SUCCESS,
            holidayDelete
        };
    };

    function failure(error) {
        return {
            type: HolidayConstants.DELETE_HOLIDAY_FAILURE,
            error
        };
    };
}

// cập nhật thông tin kỷ luật của nhân viên
function updateHoliday(id, infoHoliday) {
    return dispatch => {
        dispatch(request());

        HolidayService.updateHoliday(id, infoHoliday)
            .then(
                infoHoliday => dispatch(success(infoHoliday)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: HolidayConstants.UPDATE_HOLIDAY_REQUEST,
        };
    };

    function success(infoHoliday) {
        return {
            type: HolidayConstants.UPDATE_HOLIDAY_SUCCESS,
            infoHoliday
        };
    };

    function failure(error) {
        return {
            type: HolidayConstants.UPDATE_HOLIDAY_FAILURE,
            error
        };
    };
}