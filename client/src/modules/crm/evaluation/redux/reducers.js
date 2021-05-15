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

            return {
                ...state,
                isLoading: true
            }

        case CrmEvaluationConstants.GET_CRM_EVALUATIONS_FAILE:
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


     
        default:
            return state;
    }
}