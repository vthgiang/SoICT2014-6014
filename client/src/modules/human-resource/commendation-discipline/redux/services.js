import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';
export const DisciplineService = {
    getListDiscipline,
    createNewDiscipline,
    deleteDiscipline,
    updateDiscipline,

    getListPraise,
    createNewPraise,
    deletePraise,
    updatePraise,
}
/**
 * Start
 * Quản lý kỷ luật
 * 
 */
// Lấy danh sách kỷ luật
function getListDiscipline(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/discipline/paginate`,
        method: 'POST',
        data: data
    }, false, 'human_resource.commendation_discipline.discipline');
}

// Thêm mới kỷ luật của nhân viên
function createNewDiscipline(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/discipline/create`,
        method: 'POST',
        data: data
    }, true, 'human_resource.commendation_discipline.discipline');
}

// Xoá thông tin kỷ luật của nhân viên
function deleteDiscipline(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/discipline/${id}`,
        method: 'DELETE',
    }, true, 'human_resource.commendation_discipline.discipline');
}

// Cập nhật thông tin kỷ luật của nhân viên
function updateDiscipline(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/discipline/${id}`,
        method: 'PUT',
        data: data,
    }, true, 'human_resource.commendation_discipline.discipline');
}
/**
 * End
 * Quản lý kỷ luật
 * 
 */

/**
 * Start
 * Quản lý khen thưởng
 * 
 */
// Lấy danh sách khen thưởng
function getListPraise(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/praise/paginate`,
        method: 'POST',
        data: data
    }, false, 'human_resource.commendation_discipline.commendation');
}

// Thêm mới thông tin khen thưởng
function createNewPraise(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/praise/create`,
        method: 'POST',
        data: data
    }, true, 'human_resource.commendation_discipline.commendation');
}

// Xoá thông tin khen thưởng
function deletePraise(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/praise/${id}`,
        method: 'DELETE',
    }, true, 'human_resource.commendation_discipline.commendation');
}

// Cập nhật thông tin khen thưởng
function updatePraise(id, data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/praise/${id}`,
        method: 'PUT',
        data: data,
    }, true, 'human_resource.commendation_discipline.commendation');
}
/**
 * End
 * Quản lý khen thưởng
 * 
 */