import { Constants } from './constants';
const initState ={
    isLoading: false,
    employee: "",
    salary: "",
    annualLeave: "",
    commendation: "",
    discipline: "",
    infoEmployeeUpdate: "",
    error: ""
}

export function employeesInfo(state = initState, action) {
    switch (action.type) {
        case Constants.GET_PERSONAL_INFOR_REQUEST:
        case Constants.UPDATE_PERSONAL_INFOR_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case Constants.GET_PERSONAL_INFOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                employee: action.payload.employee,
                salary: action.payload.salary,
                annualLeave: action.payload.annualLeave,
                commendation: action.payload.commendation,
                discipline: action.payload.discipline
            };
        case Constants.UPDATE_PERSONAL_INFOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                infoEmployeeUpdate: action.payload
            };
        case Constants.GET_PERSONAL_INFOR_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        case Constants.UPDATE_PERSONAL_INFOR_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}