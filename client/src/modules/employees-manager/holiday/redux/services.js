import {
    handleResponse
} from '../../../../helpers/HandleResponse';
import {
    AuthenticateHeader
} from '../../../../config';
export const HolidayService = {
    getListHoliday,
    createNewHoliday,
    deleteHoliday,
    updateHoliday,
}

// Lấy danh sách nghỉ lễ tết
function getListHoliday() {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader(),
    };

    return fetch(`/holiday/`, requestOptions).then(handleResponse);

}

// tạo mới thông tin nghỉ lễ tết
function createNewHoliday(data) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };

    return fetch(`/holiday/create`, requestOptions).then(handleResponse);
}

// Xoá thông tin nghỉ lễ tết
function deleteHoliday(id) {
    const requestOptions = {
        method: 'DELETE',
    };

    return fetch(`/holiday/${id}`, requestOptions).then(handleResponse);
}

// Cập nhật thông tin nghỉ lễ tết
function updateHoliday(id, data) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`/holiday/${id}`, requestOptions).then(handleResponse);
}