import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmEvaluationServices = {
    getEvaluations,getCustomerCareInfoByEmployee
    
};

function getEvaluations(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/evaluations`,
        method: 'GET',
        params,
    }, false, true, 'crm.evaluation');
}
function getCustomerCareInfoByEmployee(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/evaluations/${id}`,
        method: 'GET',
    }, false, true, 'crm.evaluation');
}
