import { sendRequest } from '../../../helpers/requestHelper';

export const exprimentalAnalysisServices = {
    analysis,
    createRiskDataset,
    createTaskDataset,
    createRiskInformation,
    createTaskInformation,
    createPertData,
    getProbabilityDistribution
};
function analysis(){
    return sendRequest({
        url : `${process.env.REACT_APP_SERVER}/exprimentalAnalysis`,
        method : 'POST',
    }, true, true);
}
function getProbabilityDistribution (data){
    return sendRequest({
        url : `${process.env.REACT_APP_SERVER}/exprimentalAnalysis/probabilityDistribution`,
        method : 'POST',
        // data: datas
    }, true, true);
}
function createRiskDataset(data){
    return sendRequest({
        url : `${process.env.REACT_APP_SERVER}/exprimentalAnalysis/riskDataset`,
        method : 'POST',
        data : data
    }, false, false);
}
function createRiskInformation(data){
    return sendRequest({
        url : `${process.env.REACT_APP_SERVER}/exprimentalAnalysis/riskInformation`,
        method : 'POST',
        data : data
    }, false, false);
}

function createTaskDataset(data){
    return sendRequest({
        url : `${process.env.REACT_APP_SERVER}/exprimentalAnalysis/taskDataset`,
        method : 'POST',
        data : data
    }, false, false);
}
function createTaskInformation(data){
    // console.log('create task iNof')
    return sendRequest({
        url : `${process.env.REACT_APP_SERVER}/exprimentalAnalysis/taskInformation`,
        method : 'POST',
        data : data
    }, false, false);
}
function createPertData(data){
    // console.log('create task iNof')
    return sendRequest({
        url : `${process.env.REACT_APP_SERVER}/exprimentalAnalysis/pertData`,
        method : 'POST',
        data : data
    }, false, false);
}