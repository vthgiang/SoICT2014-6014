import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const MajorService = {
    getListMajor,
    createMajor,
    deleteMajor,
    updateMajor,
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

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu kỷ luật cần thêm 
 */
function deleteMajor(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/majors/major`,
        method: 'DELETE',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu kỷ luật cần thêm 
 */
function updateMajor(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/majors/major/${data.majorId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}
