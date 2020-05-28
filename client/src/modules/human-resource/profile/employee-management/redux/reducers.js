import {
    EmployeeConstants
} from './constants';
const initState = {
    isLoading: false,
    totalList: '',
    totalEmployee: '',
    listAllEmployees: [],
    listEmployees: [],
    error: '',
}
export function employeesManager(state = initState, action) {
    switch (action.type) {
        case EmployeeConstants.GETALL_REQUEST:
        case EmployeeConstants.ADDEMPLOYEE_REQUEST:
        case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_REQUEST:
        case EmployeeConstants.DELETE_EMPLOYEE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.GETALL_SUCCESS:
            if (action.payload.totalEmployee !== undefined) {
                return {
                    ...state,
                    listAllEmployees: action.payload.listAllEmployees,
                    totalEmployee: action.payload.totalEmployee,
                    isLoading: false
                }
            } else {
                return {
                    ...state,
                    listEmployees: action.payload.data,
                    totalList: action.payload.totalList,
                    isLoading: false
                };
            }

            case EmployeeConstants.ADDEMPLOYEE_SUCCESS:
                return {
                    ...state,
                    listEmployees: [...state.listEmployees, action.payload],
                        isLoading: false
                };
            case EmployeeConstants.ADDEMPLOYEE_FAILURE:
                return {
                    error: action.error,
                        isLoading: false,
                };
            case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_SUCCESS:
                return {
                    ...state,
                    listEmployees: state.listEmployees.map(employee => employee._id === action.payload._id ? action.payload : employee),
                        isLoading: false
                };
            case EmployeeConstants.DELETE_EMPLOYEE_SUCCESS:
                return {
                    ...state,
                    listEmployees: state.listEmployees.filter(list => (list.employees[0]._id !== action.payload._id)),
                        isLoading: false,
                };

            case EmployeeConstants.GETALL_FAILURE:
            case EmployeeConstants.ADDEMPLOYEE_FAILURE:
            case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_FAILURE:
            case EmployeeConstants.DELETE_EMPLOYEE_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                        error: action.error
                };
            default:
                return state
    }
}