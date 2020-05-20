import {
    EmployeeConstants
} from './constants';
const initState = {
    isLoading: false,
    totalList: '',
    listEmployee: [],
    error: '',
    checkArrayMSNV: []
}
export function employeesManager(state = initState, action) {
    switch (action.type) {
        case EmployeeConstants.GETALL_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.GETALL_SUCCESS:
            return {
                ...state,
                listEmployee: action.payload.data,
                    totalList: action.payload.totalList,
                    isLoading: false
            };
        case EmployeeConstants.GETALL_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case EmployeeConstants.ADDEMPLOYEE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.ADDEMPLOYEE_SUCCESS:
            return {
                ...state,
                listEmployee: [...state.listEmployee, action.payload],
                    isLoading: false
            };
        case EmployeeConstants.ADDEMPLOYEE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_SUCCESS:
            return {
                ...state,
                infoEmployeeUpdate: action.informationEmployee.content,
                    isLoading: false
            };
        case EmployeeConstants.UPDATE_INFOR_EMPLOYEE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case EmployeeConstants.DELETE_EMPLOYEE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case EmployeeConstants.DELETE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                listEmployee: state.listEmployee.filter(list => (list.employees[0]._id !== action.payload._id)),
                    isLoading: false,
            };
        case EmployeeConstants.DELETE_EMPLOYEE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        default:
            return state
    }
}