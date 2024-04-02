import { riskResponsePlanRequestConstants } from './constants';
const initState = {
    lists: [],
    listRiskById: null,
    isLoading: false,
    totalList: 0,
    tasksByRisk: []
}
export function riskResponsePlanRequest(state = initState, action) {

    switch (action.type) {
        case riskResponsePlanRequestConstants.GET_RISK_RESPONSE_PLAN_REQUEST_REQUEST:
        case riskResponsePlanRequestConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST_REQUEST:
        case riskResponsePlanRequestConstants.EDIT_RISK_RESPONSE_PLAN_REQUEST_REQUEST:
        case riskResponsePlanRequestConstants.DELETE_RISK_RESPONSE_PLAN_REQUEST_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case riskResponsePlanRequestConstants.GET_RISK_RESPONSE_PLAN_REQUEST_FAILURE:
        case riskResponsePlanRequestConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST_FAILURE:
        case riskResponsePlanRequestConstants.EDIT_RISK_RESPONSE_PLAN_REQUEST_FAILURE:
        case riskResponsePlanRequestConstants.DELETE_RISK_RESPONSE_PLAN_REQUEST_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case riskResponsePlanRequestConstants.EDIT_RISK_RESPONSE_PLAN_REQUEST_SUCCESS:
            console.log('actionPaylod',action.payload)
            return {
                ...state,
                lists: state.lists.map(risk => ((risk._id === action.payload._id) ? action.payload : risk)),
                listRiskById: action.payload,
                isLoading: false,
            }
        case riskResponsePlanRequestConstants.DELETE_RISK_RESPONSE_PLAN_REQUEST_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(risk => (risk._id !== action.payload._id)),
                isLoading: false,
            };
        case riskResponsePlanRequestConstants.GET_RISK_RESPONSE_PLAN_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                lists: action.payload.lists,
                totalList: action.payload.totalList
            }
        case riskResponsePlanRequestConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST_SUCCESS:
            return {
                ...state,
                lists: [
                    action.payload,
                    ...state.lists
                ],
                isLoading: false
            };
        case riskResponsePlanRequestConstants.CREATE_RISK_RESPONSE_PLAN_REQUEST_REQUEST:
            return {
                ...state,
                lists: [
                    action.payload,
                    ...state.lists
                ],
                isLoading: false
            };
        default:
            return state;
    }
}