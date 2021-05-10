import { CrmEvaluationServices } from "./services";
import { CrmEvaluationConstants } from "./constants";

export const CrmEvaluationActions = {
    getEvaluations
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
