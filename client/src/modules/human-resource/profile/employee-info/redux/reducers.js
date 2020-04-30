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
                employees: action.payload.employees,
                salarys: action.payload.salarys,
                annualLeaves: action.payload.annualLeaves,
                commendations: action.payload.commendations,
                disciplines: action.payload.disciplines
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