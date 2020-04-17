import { Constants } from './constants';
const initState ={
    isLoading: false,
    employee: "",
    employeeContact: "",
    salary: "",
    sabbatical: "",
    praise: "",
    discipline: "",
    infoEmployeeUpdate: "",
    error: ""
}

export function employeesInfo(state = initState, action) {
    switch (action.type) {
        case Constants.GET_INFOR_PERSONAL_REQUEST:
        case Constants.UPDATE_INFOR_PERSONAL_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case Constants.GET_INFOR_PERSONAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                employee: action.payload.employee,
                employeeContact: action.payload.employeeContact,
                salary: action.payload.salary,
                sabbatical: action.payload.sabbatical,
                praise: action.payload.praise,
                discipline: action.payload.discipline
            };
        case Constants.UPDATE_INFOR_PERSONAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                infoEmployeeUpdate: action.payload
            };
        case Constants.GET_INFOR_PERSONAL_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        case Constants.UPDATE_INFOR_PERSONAL_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}