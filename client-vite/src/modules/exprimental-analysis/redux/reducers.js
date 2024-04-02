import { IntlActions } from 'react-redux-multilingual';
import { exprimentalAnalysisConstants } from './constants';
const initState = {
    isLoading:false,
    riskDataset:false,
    taskDataset:false,
    riskInfo:false,
    taskInfo:false,
    pertData:false,
    data:[],
    error:[],
    probabilityDistribution:[]
}
export function exprimentalData(state = initState, action) {

    switch (action.type) {
        case exprimentalAnalysisConstants.EXPRIMENTAL_ANALYSIS_REQUEST:
        case exprimentalAnalysisConstants.CREATE_RISK_DATASET_REQUEST:
        case exprimentalAnalysisConstants.CREATE_TASK_DATASET_REQUEST:
        case exprimentalAnalysisConstants.CREATE_RISK_INFORMATION_REQUEST:
        case exprimentalAnalysisConstants.CREATE_TASK_INFORMATION_REQUEST:
        case exprimentalAnalysisConstants.CREATE_PERT_DATA_REQUEST:
        case exprimentalAnalysisConstants.GET_PROBABILITY_DISTRIBUTION_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case exprimentalAnalysisConstants.EXPRIMENTAL_ANALYSIS_FAILURE:
        case exprimentalAnalysisConstants.CREATE_RISK_DATASET_FAILURE:
        case exprimentalAnalysisConstants.CREATE_PERT_DATA_FAILURE:
        case exprimentalAnalysisConstants.CREATE_RISK_INFORMATION_FAILURE:
        case exprimentalAnalysisConstants.CREATE_TASK_INFORMATION_FAILURE:
        case exprimentalAnalysisConstants.CREATE_RISK_DATASET_FAILURE:
        case exprimentalAnalysisConstants.GET_PROBABILITY_DISTRIBUTION_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case exprimentalAnalysisConstants.GET_PROBABILITY_DISTRIBUTION_SUCCESS:
            return {
                ...state,
                probabilityDistribution:action.payload,
                isLoading:false
            }
        case exprimentalAnalysisConstants.CREATE_PERT_DATA_SUCCESS:
            return {
                ...state,
                pertData:true,
                isLoading:false
            }
        case exprimentalAnalysisConstants.CREATE_TASK_INFORMATION_SUCCESS:
            return{
                ...state,
                taskInfo:true,
                isLoading:false
            }
        case exprimentalAnalysisConstants.CREATE_RISK_DATASET_SUCCESS:
            return {
                ...state,
                riskDataset: true,
                isLoading:false
            }
        case exprimentalAnalysisConstants.EXPRIMENTAL_ANALYSIS_SUCCESS:
            return {
                ...state,
                data: action.payload,
                isLoading:false
            }
        case exprimentalAnalysisConstants.CREATE_RISK_INFORMATION_SUCCESS:
            return {
                ...state,
                riskInfo: true,
                isLoading:false
            }
        case exprimentalAnalysisConstants.CREATE_TASK_DATASET_SUCCESS:
            return {
                ...state,
                taskDataset: true,
                isLoading:false
            }
        default:
            return state;
    }
}