import {riskResponsePlanConstants} from './constants'
import {riskResponsePlanServices} from './services'

const getRiskResponsePlans = (data) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_REQUEST
        });
        riskResponsePlanServices.getRiskResponsePlans(data)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_FAILURE,
                });
            })
    }
}
const getRiskResponsePlanById = (id) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_ID_REQUEST
        });
        riskResponsePlanServices.getRiskResponsePlanById(id)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_ID_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_ID_FAILURE,
                });
            })
    }
}
const deleteRiskResponsePlan = (id) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanConstants.DELETE_RISK_RESPONSE_PLAN_REQUEST
        });
        riskResponsePlanServices.deleteRiskResponsePlan(id)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanConstants.DELETE_RISK_RESPONSE_PLAN_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanConstants.DELETE_RISK_RESPONSE_PLAN_FAILURE,
                });
            })
    }
}
const createRiskResponsePlan = (data) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST
        });
        riskResponsePlanServices.createRiskResponsePlan(data)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanConstants.CREATE_RISK_RESPONSE_PLAN_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanConstants.CREATE_RISK_RESPONSE_PLAN_FAILURE,
                });
            })
    }
}
const editRiskResponsePlan = (id,data) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanConstants.EDIT_RISK_RESPONSE_PLAN_REQUEST
        });
        riskResponsePlanServices.editRiskResponsePlan(id,data)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanConstants.EDIT_RISK_RESPONSE_PLAN_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanConstants.EDIT_RISK_RESPONSE_PLAN_FAILURE,
                });
            })
    }
}
const getRiskResponsePlanByRiskId = (id) =>{
    return dispatch => {
        dispatch({
            type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_RISK_ID_REQUEST
        });
        riskResponsePlanServices.getRiskResponsePlanByRiskId(id)
            .then(res => {
                
                dispatch({
                    type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_RISK_ID_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_RISK_ID_FAILURE,
                });
            })
    }
}
export const riskResponsePlanActions = {
    getRiskResponsePlans,
    getRiskResponsePlanById,
    createRiskResponsePlan,
    deleteRiskResponsePlan,
    editRiskResponsePlan,
    getRiskResponsePlanByRiskId
}