import { getStorage } from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

const getRiskResponsePlans = (queryData) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlan`,
        method: 'GET',
        params: {
            name: queryData?.name?queryData.name:"",
            page: queryData?.page ? queryData.page : null,
            perPage: queryData?.perPage ? queryData.perPage : null,
        },
    }, false, false, 'manage_risk_plan');
}
const createRiskResponsePlan = (data) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlan`,
        method: 'POST',
        data, //data: data ===> data,
    }, true, true, 'manage_risk_plan');
}
const deleteRiskResponsePlan = (id) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlan/${id}`,
        method: 'DELETE',
    }, true, true, 'manage_risk_plan');
}
const getRiskResponsePlanById = (id) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlan/${id}`,
        method: 'GET',
    }, true, true, 'manage_risk_plan');
}
const editRiskResponsePlan = (id,data) =>{
    console.log('data',data)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlan/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'manage_risk_plan');
}
const getRiskResponsePlanByRiskId = (riskID) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlan/riskId/${riskID}`,
        method: 'GET',
    }, false, false, 'manage_risk_plan');
}
export const riskResponsePlanServices = {
    getRiskResponsePlans,
    createRiskResponsePlan,
    getRiskResponsePlanById,
    deleteRiskResponsePlan,
    editRiskResponsePlan,
    getRiskResponsePlanByRiskId
}