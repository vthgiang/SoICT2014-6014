import {
    AnnualLeaveConstants
} from './constants';
const initState = {
    isLoading: false,
    numberAnnulLeave: 0,
    listAnnualLeavesOfOneYear: [],
    beforAndAfterOneWeeks: [],

    listAnnualLeaves: [],
    totalList: 0,
    totalListAnnulLeave:[],

    totalListAnnualLeavesOfYear: 0,
    arrMonth: [],
    listAnnualLeaveOfNumberMonth: [],
    importStatus: false,
    importAnnualLeave:[],
    error: "",
}
export function annualLeave(state = initState, action) {
    switch (action.type) {
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_REQUEST:
        case AnnualLeaveConstants.IMPORT_ANNUAL_LEAVE_REQUEST:
            if(action.beforAndAfterOneWeek){
                return {
                    ...state,
                    isLoading: true,
                    beforAndAfterOneWeeks: [],
                };
            }
            return {
                ...state,
                isLoading: true,
                    arrMonth: [],
            };
            
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_SUCCESS:
            if(action.beforAndAfterOneWeek){
                return {
                    ...state,
                    isLoading: false,
                    beforAndAfterOneWeeks: action.payload,
                }
            } else if (action.payload.numberAnnulLeave !== undefined) {
                return {
                    ...state,
                    isLoading: false,
                    numberAnnulLeave: action.payload.numberAnnulLeave,
                    listAnnualLeavesOfOneYear: action.payload.listAnnualLeavesOfOneYear
                }
            } else if (action.payload.arrMonth) {
                return {
                    ...state,
                    isLoading: false,
                    arrMonth: action.payload.arrMonth,
                    listAnnualLeaveOfNumberMonth: action.payload.listAnnualLeaveOfNumberMonth,
                }
            } else {
                return {
                    ...state,
                    isLoading: false,
                    listAnnualLeaves: action.payload.listAnnualLeaves !== undefined ? action.payload.listAnnualLeaves : [],
                    totalList: action.payload.totalList,
                    totalListAnnulLeave: action.payload.totalListAnnulLeave ? action.payload.totalListAnnulLeave : [],
                    totalListAnnualLeavesOfYear: action.payload.totalListOfYear ? action.payload.totalListOfYear : 0
                };
            };

        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAnnualLeaves: [...state.listAnnualLeaves, action.payload],
                listAnnualLeavesOfOneYear: [...state.listAnnualLeavesOfOneYear, action.payload]
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
                listAnnualLeaves: state.listAnnualLeaves.map(sabbatical => sabbatical._id === action.payload._id ? action.payload : sabbatical),
            };
        case AnnualLeaveConstants.IMPORT_ANNUAL_LEAVE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                importStatus: true,
                importAnnualLeave: action.payload.content,
            };
        case AnnualLeaveConstants.GET_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.CREATE_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.DELETE_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.UPDATE_ANNUAL_LEAVE_FAILURE:
        case AnnualLeaveConstants.IMPORT_ANNUAL_LEAVE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state
    }
}