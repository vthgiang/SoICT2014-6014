import { riskResponsePlanConstants } from './constants';
const initState = {
    lists: [],
    listRiskById: null,
    isLoading: false,
    totalList: 0,
    tasksByRisk :[]
}
export function riskResponsePlan(state = initState, action) {

    switch (action.type) {
        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_REQUEST:
        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_ID_REQUEST:
        case riskResponsePlanConstants.DELETE_RISK_RESPONSE_PLAN_REQUEST:
        case riskResponsePlanConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST:
        case riskResponsePlanConstants.EDIT_RISK_RESPONSE_PLAN_REQUEST:
        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_RISK_ID_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_FAILURE:
        case riskResponsePlanConstants.DELETE_RISK_RESPONSE_PLAN_FAILURE:
        case riskResponsePlanConstants.CREATE_RISK_RESPONSE_PLAN_FAILURE:
        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_ID_FAILURE:
        case riskResponsePlanConstants.EDIT_RISK_RESPONSE_PLAN_FAILURE:
        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_RISK_ID_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_RISK_ID_SUCCESS:
            return {
                ...state,
                isLoading:false,
                listRiskByRiskId:action.payload,
            }
        case riskResponsePlanConstants.EDIT_RISK_RESPONSE_PLAN_SUCCESS:
            return {
                ...state,
                lists: state.lists.map(risk => ((risk._id === action.payload._id) ? action.payload : risk)),
                listRiskById: action.payload,
                isLoading: false,
            }
        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_SUCCESS:
            return {
                ...state,
                lists: action.payload.lists,
                totalList: action.payload.totalList,
                isLoading: false,
            };


        case riskResponsePlanConstants.DELETE_RISK_RESPONSE_PLAN_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(risk => (risk._id !== action.payload._id)),
                isLoading: false,
            };


        case riskResponsePlanConstants.CREATE_RISK_RESPONSE_PLAN_SUCCESS:
            return {
                ...state,
                lists: [
                    action.payload,
                    ...state.lists
                ],
                isLoading: false
            };


        case riskResponsePlanConstants.GET_RISK_RESPONSE_PLAN_BY_ID_SUCCESS:
            return {
                ...state,
                listRiskById: action.payload,
                // totalList: action.payload.totalList,
                isLoading: false,
            };


        case riskResponsePlanConstants.EDIT_RISK_RESPONSE_PLAN_SUCCESS:
            return {
                ...state,
                lists: state.lists.map(risk => ((risk._id === action.payload._id) ? action.payload : risk)
                ),
                listRiskById: action.payload,
                isLoading: false,
            };

        default:
            return state;
    }
}