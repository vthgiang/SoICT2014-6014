import { sendRequest } from '../../../../helpers/requestHelper';

export const CrmEvaluationServices = {
    getEvaluations,
    
};

function getEvaluations(params) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/crm/evaluations`,
        method: 'GET',
        params,
    }, false, true, 'crm.evaluation');
}
