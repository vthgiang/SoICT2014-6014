import {
    employeeConstants
} from './constants';

export function employees(state = {}, action) {
    switch (action.type) {
        case employeeConstants.GETALL_REQUEST:
            return {
                ...state,
                loadingMany: true
            };
        case employeeConstants.GETALL_SUCCESS:
            return {
                ...state,
                allEmployee: action.employees.content.allEmployee
            };
        case employeeConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case employeeConstants.GETLIST_EMPLOYEE_REQUEST:
            return {
                ...state,
                loadingList: true
            };
        case employeeConstants.GETLIST_EMPLOYEE_SUCCESS:
            return {
                ...state,
                chiefDepartment: action.employees.content.chiefDepartment,
                    deputyDepartment: action.employees.content.deputyDepartment,
                    listEmployee: action.employees.content.listEmployee,

            };
        case employeeConstants.GETLIST_EMPLOYEE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}