import { CrmEvaluationConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    list: [],
    totalDocs: 0,
    isLoading: true,
}

export function evaluations(state = initState, action) {

    switch (action.type) {
        case CrmEvaluationConstants.GET_CRM_EVALUATIONS_REQUEST:
        case CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_EMPLOYEE_REQUEST:
        case CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_UNIT_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case CrmEvaluationConstants.GET_CRM_EVALUATIONS_FAILE:
        case CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_EMPLOYEE_FAILE:
        case CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_UNIT_FAILE:
            return {
                ...state,
                isLoading: false
            }



        case CrmEvaluationConstants.GET_CRM_EVALUATIONS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false,
            };
        case CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_EMPLOYEE_SUCCESS:
            return {
                ...state,
                customerCareInfoByEmployee: action.payload,
                isLoading: false,
            };
        case CrmEvaluationConstants.GET_CRM_CARE_INFO_BY_UNIT_SUCCESS:
            return {
                ...state,
                customerCareInfoByUnit: action.payload,
                isLoading: false,
            };


        default:
            return state;
    }
}