import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const MajorService = {
    getListMajor,
    createMajor,
}
/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListMajor(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/majors/major`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu kỷ luật cần thêm 
 */
function createMajor(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/majors/major`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

// /**
//  * Xoá thông tin kỷ luật của nhân viên
//  * @id : Id kỷ luật cần xoá 
//  */
// function deleteDiscipline(id) {
//     return sendRequest({
//         url: `${ process.env.REACT_APP_SERVER }/discipline/disciplines/${id}`,
//         method: 'DELETE',
//     }, true, true, 'human_resource.commendation_discipline.discipline');
// }

// /**
//  * Cập nhật thông tin kỷ luật của nhân viên
//  * @id : Id kỷ luật cần cập nhật 
//  * @data  : Dữ liệu cập nhật
//  */
// function updateDiscipline(id, data) {
//     return sendRequest({
//         url: `${ process.env.REACT_APP_SERVER }/discipline/disciplines/${id}`,
//         method: 'PATCH',
//         data: data,
//     }, true, true, 'human_resource.commendation_discipline.discipline');
// }