import {riskResponsePlanRequestConstants} from './constants'
import {riskResponsePlanRequestServices} from './services'

const getRiskResponsePlanRequests = (data) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanRequestConstants.GET_RISK_RESPONSE_PLAN_REQUEST_REQUEST
        });
        riskResponsePlanRequestServices.getRiskResponsePlanRequests(data)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanRequestConstants.GET_RISK_RESPONSE_PLAN_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanRequestConstants.GET_RISK_RESPONSE_PLAN_REQUEST_FAILURE,
                });
            })
    }
}
const createRiskResponsePlanRequest = (data) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanRequestConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST_REQUEST
        });
        riskResponsePlanRequestServices.createRiskResponsePlanRequest(data)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanRequestConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanRequestConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST_FAILURE,
                });
            })
    }
}
const editChangeRequest = (id,data) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanRequestConstants.EDIT_RISK_RESPONSE_PLAN_REQUEST_REQUEST
        });
        riskResponsePlanRequestServices.editChangeRequest(id,data)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanRequestConstants.EDIT_RISK_RESPONSE_PLAN_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanRequestConstants.EDIT_RISK_RESPONSE_PLAN_REQUEST_FAILURE,
                });
            })
    }
}
const deleteChangeRequest = (id,data) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanRequestConstants.DELETE_RISK_RESPONSE_PLAN_REQUEST_REQUEST
        });
        riskResponsePlanRequestServices.deleteChangeRequest(id)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanRequestConstants.DELETE_RISK_RESPONSE_PLAN_REQUEST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanRequestConstants.DELETE_RISK_RESPONSE_PLAN_REQUEST_FAILURE,
                });
            })
    }
}
export const riskResponsePlanRequestActions = {
    getRiskResponsePlanRequests,
    createRiskResponsePlanRequest,
    editChangeRequest,
    deleteChangeRequest
}