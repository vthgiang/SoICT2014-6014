import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const HolidayService = {
    getListHoliday,
    createNewHoliday,
    deleteHoliday,
    updateHoliday,
}
/**
 * Lấy danh sách nghỉ lễ tết
 */
function getListHoliday() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/holiday/`,
        method: 'GET',
    }, false, true, 'human_resource.holiday');
}

/**
 * Thêm mới thông tin nghỉ lễ tết
 * @param {*} data : dữ liệu thông tin nghỉ lễ tết cần tạo
 */
function createNewHoliday(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/holiday/create`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.holiday');
}

/**
 * Xoá thông tin nghỉ lễ tết
 * @param {*} id :id thông tin nghỉ lễ tết cần xoá
 */
function deleteHoliday(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/holiday/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.holiday');
}

/**
 * Chỉnh sửa thông tin nghỉ lễ tết
 * @param {*} id : id thông tin nghỉ lễ tết cần chỉnh sửa
 * @param {*} data : dữ liệu chỉnh sửa thông tin nghỉ lễ têt
 */
function updateHoliday(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/holiday/${id}`,
        method: 'PUT',
        data: data
    }, true, true, 'human_resource.holiday');
}