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
 */

/**
 * Lấy danh sách kỷ luật
 * @data : dữ liệu key tìm kiếm 
 */
function getListDiscipline(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/discipline/paginate`,
        method: 'POST',
        data: data
    }, false, 'human_resource.commendation_discipline.discipline');
}

/**
 * Thêm mới kỷ luật của nhân viên
 * @data : dữ liệu kỷ luật cần thêm 
 */
function createNewDiscipline(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/discipline/create`,
        method: 'POST',
        data: data
    }, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Xoá thông tin kỷ luật của nhân viên
 * @id : Id kỷ luật cần xoá 
 */
function deleteDiscipline(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/discipline/${id}`,
        method: 'DELETE',
    }, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Cập nhật thông tin kỷ luật của nhân viên
 * @id : Id kỷ luật cần cập nhật 
 * @data  : dữ liệu cập nhật
 */
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
 */

/**
 * Start
 * Quản lý khen thưởng
 */

/**
 * Lấy danh sách khen thưởng
 * @data : dữ liệu key tìm kiếm 
 */
function getListPraise(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/praise/paginate`,
        method: 'POST',
        data: data
    }, false, 'human_resource.commendation_discipline.commendation');
}

/**
 * Thêm mới thông tin khen thưởng
 * @data : dữ liệu khen thưởng thêm mới
 */
function createNewPraise(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/praise/create`,
        method: 'POST',
        data: data
    }, true, 'human_resource.commendation_discipline.commendation');
}

/**
 * Xoá thông tin khen thưởng
 * @id : Id khen thương cần xoá 
 */
function deletePraise(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/praise/${id}`,
        method: 'DELETE',
    }, true, 'human_resource.commendation_discipline.commendation');
}
/**
 * Cập nhật thông tin khen thưởng
 * @id : id khen thưởng cần cập nhật
 * @data  : Dữ liệu cập nhật khen thưởng
 */
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
 */