import { getStorage } from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

const getRiskResponsePlanRequests = (queryData) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlanRequest`,
        method: 'GET',
        params: {
            name: queryData?.name?queryData.name:"",
            page: queryData?.page ? queryData.page : null,
            perPage: queryData?.perPage ? queryData.perPage : null,
        },
    }, false, false, 'process_analysis.request_change_process');
}
const createRiskResponsePlanRequest = (data) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlanRequest`,
        method: 'POST',
        data, //data: data ===> data,
    }, true, true, 'process_analysis.request_change_process');
}
const editChangeRequest = (id,data) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlanRequest/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'process_analysis.request_change_process');
}
const deleteChangeRequest = (id) =>{
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskResponsePlanRequest/${id}`,
        method: 'DELETE',
    }, true, true, 'process_analysis.request_change_process');
}
export const riskResponsePlanRequestServices = {
    getRiskResponsePlanRequests,
    createRiskResponsePlanRequest,
    editChangeRequest,
    deleteChangeRequest
}