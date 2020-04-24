import { SabbaticalConstants } from './constants';
const initState = {
    isLoading: false,
    listAnnualLeaves: [],
    totalList: "",
    error:"",
}
export function annualLeave(state =initState, action) {
    switch (action.type) {
        case SabbaticalConstants.GET_SABBATICAL_REQUEST:
        case SabbaticalConstants.CREATE_SABBATICAL_REQUEST:
        case SabbaticalConstants.DELETE_SABBATICAL_REQUEST:
        case SabbaticalConstants.UPDATE_SABBATICAL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SabbaticalConstants.GET_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: action.payload.listAnnualLeaves,
                totalList: action.payload.totalList,   
            };
        case SabbaticalConstants.CREATE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: [...state.listAnnualLeaves, action.payload],
            };
        case SabbaticalConstants.DELETE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: state.listAnnualLeaves.filter(sabbatical => (sabbatical._id !== action.payload._id)),
            };
        case SabbaticalConstants.UPDATE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: state.listAnnualLeaves.map(sabbatical =>sabbatical._id === action.payload._id ?action.payload : sabbatical),
            };
        case SabbaticalConstants.GET_SABBATICAL_FAILURE:
        case SabbaticalConstants.CREATE_SABBATICAL_FAILURE:
        case SabbaticalConstants.DELETE_SABBATICAL_FAILURE:
        case SabbaticalConstants.UPDATE_SABBATICAL_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}