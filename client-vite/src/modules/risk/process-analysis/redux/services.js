import { sendRequest } from '../../../../helpers/requestHelper';

export const TaskPertServices = {
    countTask,
    updateTask,
    updateProcessList,
    closeProcess,
    changeTime
    // getRiskDistributionById,
    // createRiskDistribution,
    // editRiskDistribution,
    // deleteRiskDistribution,
};
function changeTime(data){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskPert/changeTime`,
        method: 'POST',
        data: data
    }, true, true, 'process_analysis.change_time');
}
function closeProcess(data){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskPert/closeProcess`,
        method: 'POST',
        data: data
    }, false, true, 'manage_risk');
}
function updateProcessList(processList){
    console.log('processList',processList)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskPert`,
        method: 'POST',
        data: processList
    }, false, true, 'manage_risk');
}
function countTask(queryData) {
    // console.log(queryData)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskPert`,
        method: 'GET',
    }, false, true, 'manage_risk');
}
function updateTask(processData){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/taskPert`,
        method: 'GET',
        params:{
            process:processData._id
        }
    }, false, true, 'manage_risk'); 
}