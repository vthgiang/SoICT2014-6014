import { RiskConstants } from './constants';
const initState = {
    lists: [],
    listRiskById: null,
    isLoading: false,
    totalList: 0,
    tasksByRisk :[],
    payload:undefined
}
export function risk(state = initState, action) {

    switch (action.type) {
        case RiskConstants.GET_RISK_REQUEST:
        case RiskConstants.GET_RISK_BY_ID_REQUEST:
        case RiskConstants.DELETE_RISK_REQUEST:
        case RiskConstants.CREATE_RISK_REQUEST:
        case RiskConstants.EDIT_RISK_REQUEST:
        case RiskConstants.GET_TASK_BY_RISK_REQUEST:
        case RiskConstants.REQUEST_CLOSE_RISK_REQUEST:
        case RiskConstants.GET_RISK_PLAN_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case RiskConstants.GET_RISK_FAILURE:
        case RiskConstants.DELETE_RISK_FAILURE:
        case RiskConstants.CREATE_RISK_FAILURE:
        case RiskConstants.GET_RISK_BY_ID_FAILURE:
        case RiskConstants.EDIT_RISK_FAILURE:
        case RiskConstants.GET_TASK_BY_RISK_FAILURE:
        case RiskConstants.REQUEST_CLOSE_RISK_FAILURE:
        case RiskConstants.GET_RISK_PLAN_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case RiskConstants.GET_RISK_PLAN_SUCCESS:
            return {
                ...state,
                plans : action.payload,
                isLoading:false
            }
        case RiskConstants.REQUEST_CLOSE_RISK_SUCCESS:
            return {
                ...state,
                lists: state.lists.map(risk => ((risk._id === action.payload._id) ? action.payload : risk)),
                isLoading:false
            }
        case RiskConstants.GET_TASK_BY_RISK_SUCCESS:
            return {
                ...state,
                tasksByRisk: action.payload,
                isLoading:false
            }
        case RiskConstants.GET_RISK_SUCCESS:
            // console.log('reducer')
            // console.log(action.payload)
            return {
                ...state,
                lists: action.payload.lists,
                totalList: action.payload.totalList,
                isLoading: false,
            };


        case RiskConstants.DELETE_RISK_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(risk => (risk._id !== action.payload._id)),
                isLoading: false,
            };


        case RiskConstants.CREATE_RISK_SUCCESS:
            return {
                ...state,
                lists: [
                    action.payload,
                    ...state.lists
                ],
                isLoading: false
            };


        case RiskConstants.GET_RISK_BY_ID_SUCCESS:
            return {
                ...state,
                listRiskById: action.payload,
                // totalList: action.payload.totalList,
                isLoading: false,
            };


        case RiskConstants.EDIT_RISK_SUCCESS:
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