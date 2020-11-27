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
}

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




// ==============================

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu kỷ luật cần thêm 
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
 * @data : Dữ liệu kỷ luật cần thêm 
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
 * @data : Dữ liệu kỷ luật cần thêm 
 */
function createCareerAction(data) {
    return sendRequest({
        url: `${ process.env.REACT_APP_SERVER }/career-positions/career-actions`,
        method: 'POST',
        data: data
    }, true, true, 'human_resource.commendation_discipline.discipline');
}
