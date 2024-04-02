import { sendRequest } from '../../../../helpers/requestHelper';

export const RiskDistributionServices = {
    getRiskDistributions,
    getParentsOfRisk,
    bayesianNetworkAutoConfig,
    getRiskDistributionByName,
    // createRiskDistribution,
    editRiskDistribution,
    deleteRiskDistribution,
    updateProb,
    updateAlg
};
function updateAlg(){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk/bayes/autoConfig`,
        method: 'GET',
        
    }, true, false, 'manage_risk');
}
function editRiskDistribution(id,data){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskDistribution/${id}`,
        method: 'PATCH',
        data
    }, false, false, 'manage_risk');
}
function deleteRiskDistribution(id){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskDistribution/${id}`,
        method: 'DELETE',
    }, true, true, 'manage_risk');
}
/**
 * Lấy tất cả rủi ro
 * @param {*} queryData 
 */
function getRiskDistributions(queryData) {
    // console.log(queryData)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskDistribution`,
        method: 'GET',
        params: {
            name: queryData?.name?queryData.name:"",
            page: queryData?.page ? queryData.page : null,
            perPage: queryData?.perPage ? queryData.perPage : null
        
        },
    }, false, true, 'manage_risk');
}

function getParentsOfRisk(queryData){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskDistribution/parents`,
        method: 'GET',
        params: {
            name: queryData?.name?queryData.name:"",
        },
    }, false, true, 'manage_risk');
}
function bayesianNetworkAutoConfig(queryData){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/risk/bayes/autoConfig`,
        method: 'GET',
    }, false, true, 'manage_risk');
}
function getRiskDistributionByName(queryData){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskDistribution/name`,
        method: 'GET',
        params: {
            name: queryData?.name?queryData.name:"",
        }
    }, false, false, 'manage_risk');
}
function updateProb(queryData){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/riskDistribution/updateProb`,
        method: 'GET',
    }, false, false, 'manage_risk');
}