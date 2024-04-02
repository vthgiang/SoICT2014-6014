import { RiskDistributionConstants } from './constants';
const initState = {
    lists: [],
    listRiskById: null,
    isLoading: false,
    totalList: 0,
    parents: [],
    bayesData: [],
    parentChecked: [],
    problist: [],
    tech: ''
}
export function riskDistribution(state = initState, action) {

    switch (action.type) {
        case RiskDistributionConstants.GET_RISK_DISTRIBUTION_REQUEST:
        case RiskDistributionConstants.GET_RISK_DISTRIBUTION_BY_ID_REQUEST:
        case RiskDistributionConstants.DELETE_RISK_DISTRIBUTION_REQUEST:
        case RiskDistributionConstants.CREATE_RISK_DISTRIBUTION_REQUEST:
        case RiskDistributionConstants.EDIT_RISK_DISTRIBUTION_REQUEST:
        case RiskDistributionConstants.GET_PARENTS_OF_RISK_REQUEST:
        case RiskDistributionConstants.BAYESIAN_NETWORK_AUTO_CONFIG_REQUEST:
        case RiskDistributionConstants.UPDATE_PROBABILITY_REQUEST:
        case RiskDistributionConstants.CHANGE_ALGORITHMS_REQUEST:
        case RiskDistributionConstants.UPDATE_ALG_REQUEST:

            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case RiskDistributionConstants.GET_RISK_DISTRIBUTION_FAILURE:
        case RiskDistributionConstants.DELETE_RISK_DISTRIBUTION_FAILURE:
        case RiskDistributionConstants.CREATE_RISK_DISTRIBUTION_FAILURE:
        case RiskDistributionConstants.GET_RISK_DISTRIBUTION_BY_ID_FAILURE:
        case RiskDistributionConstants.EDIT_RISK_DISTRIBUTION_FAILURE:
        case RiskDistributionConstants.GET_PARENTS_OF_RISK_FAILURE:
        case RiskDistributionConstants.BAYESIAN_NETWORK_AUTO_CONFIG_FAILURE:
        case RiskDistributionConstants.UPDATE_PROBABILITY_FAILURE:
        case RiskDistributionConstants.CHANGE_ALGORITHMS_FAILURE:
        case RiskDistributionConstants.UPDATE_ALG_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case RiskDistributionConstants.UPDATE_ALG_SUCCESS:
            {
                return {
                    ...state,
                  isLoading:false
                }
            }
        case RiskDistributionConstants.CHANGE_ALGORITHMS_SUCCESS:
            {
                return {
                    ...state,
                    tech: action.payload
                }
            }
        case RiskDistributionConstants.UPDATE_PROBABILITY_SUCCESS:
            return {
                ...state,
                bayesData: action.payload,
                isLoading: false
            }
        case RiskDistributionConstants.GET_RISK_DISTRIBUTION_SUCCESS:
            return {
                ...state,
                lists: action.payload.lists,
                totalList: action.payload.totalList,
                isLoading: false,
            };
        case RiskDistributionConstants.GET_RISK_DISTRIBUTION_SUCCESS:
            return {
                ...state,
                listRiskById: action.payload,
                isLoading: false,
            };

        case RiskDistributionConstants.DELETE_RISK_DISTRIBUTION_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(risk => (risk._id !== action.payload._id)),
                isLoading: false,
            };


        case RiskDistributionConstants.CREATE_RISK_DISTRIBUTION_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload,
                ],
                isLoading: false
            };


        case RiskDistributionConstants.GET_RISK_DISTRIBUTION_BY_ID_SUCCESS:
            return {
                ...state,
                listRiskById: action.payload,
                // totalList: action.payload.totalList,
                isLoading: false,
            };


        case RiskDistributionConstants.EDIT_RISK_DISTRIBUTION_SUCCESS:
            return {
                ...state,
                // lists:action.payload,
                // lists: state.lists.map(risk => ((risk._id === action.payload._id) ? action.payload : risk)
                // ),
                // listRiskById: action.payload,
                isLoading: false,
            };
        case RiskDistributionConstants.GET_PARENTS_OF_RISK_SUCCESS:
            return {
                ...state,
                parents: action.payload.parents,
                parentChecked: action.payload.parentChecked,
                isLoading: false
            };
        case RiskDistributionConstants.BAYESIAN_NETWORK_AUTO_CONFIG_SUCCESS:
            return {
                ...state,
                bayesData: action.payload,
                isLoading: false
            }
        default:
            return state;
    }
}