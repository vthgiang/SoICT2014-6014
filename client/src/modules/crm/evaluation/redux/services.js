import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmEvaluationServices = {
    getEvaluations,
    getCustomerCareInfoByEmployee,
    getCustomerCareInfoByUnit
    
};

function getEvaluations(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/evaluations`,
        method: 'GET',
        params,
    }, false, true, 'crm.evaluation');
}
function getCustomerCareInfoByEmployee() {
    
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/evaluations/employee`,
        method: 'GET',
    }, false, true, 'crm.evaluation');
}
function getCustomerCareInfoByUnit() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/evaluations/crmUnit`,
        method: 'GET',
    }, false, true, 'crm.evaluation');
}