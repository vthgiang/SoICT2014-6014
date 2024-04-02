import { exprimentalAnalysisConstants } from "./constants";
import { exprimentalAnalysisServices } from "./services";

export const exprimentalAnalysisActions = {
    analysis,
    createRiskDataset,
    createTaskDataset,
    createRiskInformation,
    createTaskInformation,
    createPertData,
    getProbabilityDistribution
};
function getProbabilityDistribution(data){
    return dispatch => {
        dispatch({ type: exprimentalAnalysisConstants.GET_PROBABILITY_DISTRIBUTION_REQUEST });

        exprimentalAnalysisServices.getProbabilityDistribution(data)
            .then(res => {
                dispatch({
                    type: exprimentalAnalysisConstants.GET_PROBABILITY_DISTRIBUTION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: exprimentalAnalysisConstants.GET_PROBABILITY_DISTRIBUTION_FAILURE,
                    payload: error
                })
            })
    }
}
function createPertData(data){
    return dispatch => {
        dispatch({ type: exprimentalAnalysisConstants.CREATE_PERT_DATA_REQUEST });

        exprimentalAnalysisServices.createPertData(data)
            .then(res => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_PERT_DATA_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_PERT_DATA_FAILURE,
                    payload: error
                })
            })
    }
}
function analysis(data){
    return dispatch => {
        dispatch({ type: exprimentalAnalysisConstants.EXPRIMENTAL_ANALYSIS_REQUEST });

        exprimentalAnalysisServices.analysis(data)
            .then(res => {
                dispatch({
                    type: exprimentalAnalysisConstants.EXPRIMENTAL_ANALYSIS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: exprimentalAnalysisConstants.EXPRIMENTAL_ANALYSIS_FAILURE,
                    payload: error
                })
            })
    }
}
function createRiskDataset (data){
    return dispatch => {
        dispatch({ type: exprimentalAnalysisConstants.CREATE_RISK_DATASET_REQUEST });

        exprimentalAnalysisServices.createRiskDataset(data)
            .then(res => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_RISK_DATASET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_RISK_DATASET_FAILURE,
                    payload: error
                })
            })
    }
}
function createTaskDataset (data){
    return dispatch => {
        dispatch({ type: exprimentalAnalysisConstants.CREATE_TASK_DATASET_REQUEST });

        exprimentalAnalysisServices.createTaskDataset(data)
            .then(res => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_TASK_DATASET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_TASK_DATASET_FAILURE,
                    payload: error
                })
            })
    }
}

function createRiskInformation (data){
    return dispatch => {
        dispatch({ type: exprimentalAnalysisConstants.CREATE_RISK_INFORMATION_REQUEST });

        exprimentalAnalysisServices.createRiskInformation(data)
            .then(res => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_RISK_INFORMATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_RISK_INFORMATION_FAILURE,
                    payload: error
                })
            })
    }
}
function createTaskInformation (data){
    return dispatch => {
        dispatch({ type: exprimentalAnalysisConstants.CREATE_TASK_INFORMATION_REQUEST });

        exprimentalAnalysisServices.createTaskInformation(data)
            .then(res => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_TASK_INFORMATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: exprimentalAnalysisConstants.CREATE_TASK_INFORMATION_FAILURE,
                    payload: error
                })
            })
    }
}