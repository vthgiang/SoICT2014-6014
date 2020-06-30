import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const TimesheetsService = {
    searchTimesheets,
    createTimesheets,
    deleteTimesheets,
    updateTimesheets,
}

/**
 * Lấy danh sách chấm công
 * @data : Dữ liệu key tìm kiếm
 */ 
function searchTimesheets(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/timesheets`,
        method: 'GET',
        params: {
            organizationalUnit: data.organizationalUnit,
            position: data.position,
            employeeNumber: data.employeeNumber,
            month: data.month,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.salary');
}

/**
 * Tạo mới thông tin chấm công
 * @data : Dữ liệu chấm công mới
 */
function createTimesheets(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/timesheets`,
        method: 'POST',
        data: data,
    }, true, true, 'human_resource.salary');
}

/**
 * Xoá thông tin chấm công
 * @id : Id thông tin chấm công cần xoá
 */
function deleteTimesheets(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/timesheets/${id}`,
        method: 'DELETE',
    }, true, true, 'human_resource.salary');
}

/**
 * Cập nhật thông tin chấm công
 * @id : Id chấm công cần cập nhật
 * @data : Dữ liệu cập nhật chấm công
 */
function updateTimesheets(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/timesheets/${id}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'human_resource.salary');
}

// /**
//  * Import dữ liệu chấm công
//  * @param {*} data : Array thông tin chấm công
//  */
// function importTimesheets(data) {
//     return sendRequest({
//         url: `${ LOCAL_SERVER_API }/timesheets/import`,
//         method: 'POST',
//         data: data,
//     }, true, false, 'human_resource.timesheets');
// }

