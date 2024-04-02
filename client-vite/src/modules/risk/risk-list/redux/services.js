import { getStorage } from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const riskServices = {
    getRisks,
    getRiskById,
    createRisk,
    editRisk,
    deleteRisk,
    getTasksByRisk,
    requestCloseRisk,
    getPlans
};

/**
 * Lấy tất cả rủi ro
 * @param {*} queryData
 */
function getRisks(queryData) {
    // console.log(queryData)

    let user = queryData?.type=="getByUser"?getStorage('userId'):null

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk`,
        method: 'GET',
        params: {
            status:  queryData?.status ? queryData.status : null,
            riskName: queryData?.riskName ? queryData.riskName:"",
            page: queryData?.page ? queryData.page : null,
            perPage: queryData?.perPage ? queryData.perPage : null,
            user: user
        },
    }, false, false, 'manage_risk');
}


/**
 * lấy rủi ro theo id
 * @param {*} id id rủi ro
 */
function getRiskById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk/${id}`,
        method: 'GET'
    }, false, true, 'manage_risk');
}

function requestCloseRisk(risk) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk/requestCloseRisk/close`,
        method: 'POST',
        data:risk,
    }, true, true, 'manage_risk');
}
/**
 * Tạo mới một rủi ro
 * @param {*} Dữ liệu cần tạo
 */
function createRisk(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk`,
        method: 'POST',
        data, //data: data ===> data,
    }, true, true, 'manage_risk');
}


/**
 * Chỉnh sửa rủi ro
 * @param {*} id rủi ro
 * @param {*} data dữ liệu cần sửa
 */
function editRisk(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'manage_risk');
}


/**
 * Xóa một rủi ro
 * @param {*} id rủi ro
 */
function deleteRisk(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk/${id}`,
        method: 'DELETE',
    }, true, true, 'manage_risk');
}
function getTasksByRisk(queryData){
    // console.log('querydata',queryData)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk/task/tasksByRisk`,
        method: 'GET',
        params: {
            name: queryData?.name?queryData.name:""
        },
    }, false, false);
}
function getPlans(data){
    // console.log('querydata',queryData)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk/plans`,
        method: 'POST',
        data:data
    }, false, false);
}