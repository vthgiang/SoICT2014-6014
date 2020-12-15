import {
    sendRequest
} from '../../../../helpers/requestHelper';

export const CareerService = {
    getListCareerPosition,
    getListCareerField,
    getListCareerAction,

    createCareerField,
    createCareerPosition,
    createCareerAction,

    editCareerPosition,
    editCareerField,
    editCareerAction,

    deleteCareerField,
    deleteCareerPosition,
    deleteCareerAction,
}

// =============GET=================

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCareerPosition(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-positions`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCareerField(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-fields`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm 
 */
function getListCareerAction(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-actions`,
        method: 'GET',
        params: {
            name: data.name,
            page: data.page,
            limit: data.limit
        }
    }, false, true, 'human_resource.commendation_discipline.discipline');
}




// =============CREATE=================

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu
 */
function createCareerField(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-fields`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu 
 */
function createCareerPosition(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-positions`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu
 */
function createCareerAction(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-actions`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}


//=============EDIT===============

/**
 * Chỉnh sửa vị trí cv
 * @data : Dữ liệu
 */
function editCareerPosition(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-positions/${data.careerId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Chỉnh sửa vị trí cv
 * @data : Dữ liệu 
 */
function editCareerField(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-fields/${data.careerId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Chỉnh sửa hoạt động cv
 * @data : Dữ liệu
 */
function editCareerAction(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-actions/${data.careerId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}


// =============DELETE===============

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */
function deleteCareerField(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-fields`,
        method: 'DELETE',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */
function deleteCareerPosition(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-positions`,
        method: 'DELETE',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */
function deleteCareerAction(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-actions`,
        method: 'DELETE',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}
