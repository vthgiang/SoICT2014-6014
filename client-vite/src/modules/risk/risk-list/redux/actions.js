import { RiskConstants } from './constants';
import { riskServices } from './services';

export const riskActions = {
    getRisks,
    getRiskById,
    deleteRisk,
    createRisk,
    editRisk,
    getTasksByRisk,
    requestCloseRisk,
    getPlans
};

function getRisks(data) {
    return dispatch => {
        dispatch({
            type: RiskConstants.GET_RISK_REQUEST
        });
        riskServices.getRisks(data)
            .then(res => {
                dispatch({
                    type: RiskConstants.GET_RISK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskConstants.GET_RISK_FAILURE,
                });
            })
    }
}


function getRiskById(id) {
    return dispatch => {
        dispatch({
            type: RiskConstants.GET_RISK_BY_ID_REQUEST
        });
        riskServices.getRiskById(id)
            .then(res => {
                dispatch({
                    type: RiskConstants.GET_RISK_BY_ID_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskConstants.GET_RISK_BY_ID_FAILURE,
                });
            })
    }
}


function deleteRisk(id) {
    return dispatch => {
        dispatch({
            type: RiskConstants.DELETE_RISK_REQUEST
        });
        riskServices.deleteRisk(id)
            .then(res => {
                dispatch({
                    type: RiskConstants.DELETE_RISK_SUCCESS,
                    payload: res.data.content,
                })
            })
            .catch(err => {
                dispatch({
                    type: RiskConstants.DELETE_RISK_FAILURE,
                })
            })
    }
}


function createRisk(data) {
    // console.log('data')
    // console.log(data)
    return dispatch => {
        dispatch({
            type: RiskConstants.CREATE_RISK_REQUEST
        });
        riskServices.createRisk(data)
            .then(res => {
                dispatch({
                    type: RiskConstants.CREATE_RISK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: RiskConstants.CREATE_RISK_FAILURE,
                    error: err
                });
            })
    }
}


function editRisk(id, data) {
    return dispatch => {
        dispatch({
            type: RiskConstants.EDIT_RISK_REQUEST
        });
        riskServices.editRisk(id, data)
            .then(res => {
                dispatch({
                    type: RiskConstants.EDIT_RISK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskConstants.EDIT_RISK_FAILURE,
                    error: err
                });
            })
    }
}
function getTasksByRisk(data){
    return dispatch => {
        dispatch({
            type: RiskConstants.GET_TASK_BY_RISK_REQUEST
        });
        riskServices.getTasksByRisk(data)
            .then(res => {
                // console.log(res.data.length)
                dispatch({
                    type: RiskConstants.GET_TASK_BY_RISK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskConstants.GET_TASK_BY_RISK_FAILURE,
                    error: err
                });
            })
    }
}
function requestCloseRisk (risk){
    return dispatch => {
        dispatch({
            type: RiskConstants.REQUEST_CLOSE_RISK_REQUEST
        });
        riskServices.requestCloseRisk(risk)
            .then(res => {
                // console.log(res.data.length)
                dispatch({
                    type: RiskConstants.REQUEST_CLOSE_RISK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskConstants.REQUEST_CLOSE_RISK_FAILURE,
                    error: err
                });
            })
    }
}
function getPlans (data){
    return dispatch => {
        dispatch({
            type: RiskConstants.GET_RISK_PLAN_REQUEST
        });
        riskServices.getPlans(data)
            .then(res => {
                // console.log(res.data.length)
                dispatch({
                    type: RiskConstants.GET_RISK_PLAN_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskConstants.GET_RISK_PLAN_FAILURE,
                    error: err
                });
            })
    }
}