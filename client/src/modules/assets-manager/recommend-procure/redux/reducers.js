import { RecommendProcureConstants } from './constants';
const initState = {
    isLoading: false,
    listRecommendProcure: [],
    totalList: "",
    error:"",
}
export function recommendProcure(state =initState, action) {
    switch (action.type) {
        case RecommendProcureConstants.GET_RECOMMENDPROCURE_REQUEST:
        case RecommendProcureConstants.CREATE_RECOMMENDPROCURE_REQUEST:
        case RecommendProcureConstants.DELETE_RECOMMENDPROCURE_REQUEST:
        case RecommendProcureConstants.UPDATE_RECOMMENDPROCURE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case RecommendProcureConstants.GET_RECOMMENDPROCURE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendProcure: action.payload.listRecommendProcure,
                totalList: action.payload.totalList,   
            };
        case RecommendProcureConstants.CREATE_RECOMMENDPROCURE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendProcure: [...state.listRecommendProcure, action.payload],
            };
        case RecommendProcureConstants.DELETE_RECOMMENDPROCURE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendProcure: state.listRecommendProcure.filter(recommendProcure => (recommendProcure._id !== action.payload._id)),
            };
        case RecommendProcureConstants.UPDATE_RECOMMENDPROCURE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listRecommendProcure: state.listRecommendProcure.map(recommendProcure =>recommendProcure._id === action.payload._id ?action.payload : recommendProcure),
            };
        case RecommendProcureConstants.GET_RECOMMENDPROCURE_FAILURE:
        case RecommendProcureConstants.CREATE_RECOMMENDPROCURE_FAILURE:
        case RecommendProcureConstants.DELETE_RECOMMENDPROCURE_FAILURE:
        case RecommendProcureConstants.UPDATE_RECOMMENDPROCURE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}