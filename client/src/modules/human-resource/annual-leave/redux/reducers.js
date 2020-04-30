import { AnnualLeaveConstants } from './constants';
const initState = {
    isLoading: false,
    listAnnualLeaves: [],
    totalList: "",
    error:"",
}
export function annualLeave(state =initState, action) {
    switch (action.type) {
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: action.payload.listAnnualLeaves,
                totalList: action.payload.totalList,   
            };
        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: [...state.listAnnualLeaves, action.payload],
            };
        case AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: state.listAnnualLeaves.filter(sabbatical => (sabbatical._id !== action.payload._id)),
            };
        case AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: state.listAnnualLeaves.map(sabbatical =>sabbatical._id === action.payload._id ?action.payload : sabbatical),
            };
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}