import { CrmEvaluationServices } from "./services";
import { CrmEvaluationConstants } from "./constants";

export const CrmEvaluationActions = {
    getEvaluations,
    getCustomerCareInfoByEmployee,
    getCustomerCareInfoByUnit
};

function getEvaluations(data) {
    return dispatch => {
        dispatch({ type: CrmEvaluationConstants.GET_CRM_EVALUATIONS_REQUEST });
        CrmEvaluationServices.getEvaluations(data)
            .then(res => {
                dispatch({
                    type: CrmEvaluationConstants.GET_CRM_EVALUATIONS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmEvaluationConstants.GET_CRM_EVALUATIONS_FAILE }) })
    }
}
function getCustomerCareInfoByEmployee() {
    return dispatch => {
        dispatch({ type: CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_EMPLOYEE_REQUEST });
        CrmEvaluationServices.getCustomerCareInfoByEmployee()
            .then(res => {
                dispatch({
                    type: CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_EMPLOYEE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_EMPLOYEE_FAILE }) })
    }
}
function getCustomerCareInfoByUnit() {
    return dispatch => {
        dispatch({ type: CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_UNIT_REQUEST });
        CrmEvaluationServices.getCustomerCareInfoByUnit()
            .then(res => {
                dispatch({
                    type: CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_UNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_UNIT_FAILE }) })
    }
}
