import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const HolidayService = {
    getListHoliday,
    createNewHoliday,
    deleteHoliday,
    updateHoliday,
    importHoliday,
}

/**
 * Lấy danh sách thông tin lịch làm việc
 */
function getListHoliday(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/holiday/holidays`,
        method: 'GET',
        params: {
            year: data ? data.year : undefined,
        }
    }, false, true, 'human_resource.holiday');
}

/**
 * Thêm mới thông tin lịch làm việc
 * @param {*} data : dữ liệu thông tin lịch làm việc
 */
function createNewHoliday(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/holiday/holidays`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.holiday');
}

/**
 * Xoá thông tin lịch làm việc
 * @param {*} id :id thông tin lịch làm việc
 */
function deleteHoliday(id) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/holiday/holidays/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.holiday');
}

/**
 * Chỉnh sửa thông tin lịch làm việc
 * @param {*} id : id thông tin lịch làm việc
 * @param {*} data : dữ liệu chỉnh sửa thông tin lịch làm việc
 */
function updateHoliday(id, data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/holiday/holidays/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'human_resource.holiday');
}

/**
 * Import dữ liệu lịch làm việc
 * @param {*} data : Array thông tin lịch làm việc
 */
function importHoliday(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/holiday/holidays/import`,
        method: 'POST',
        data: data,
    }, true, false, 'human_resource.holiday');
}