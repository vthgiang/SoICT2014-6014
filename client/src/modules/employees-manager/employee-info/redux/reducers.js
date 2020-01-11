import {
    constants
} from './constants';

export function employeesInfo(state = {}, action) {
    switch (action.type) {
        case constants.ADDEMPLOYEE_REQUEST:
            return {
                ...state,
                adding: true
            };
        case constants.ADDEMPLOYEE_SUCCESS:
            return {
                ...state,
                items: action.employee
            };
        case constants.ADDEMPLOYEE_FAILURE:
            return {
                error: action.error
            };
        case constants.GETINFORMATIONEMPLOYEE_REQUEST:
            return {
                ...state,
                loadding: true
            };
        case constants.GETINFORMATIONEMPLOYEE_SUCCESS:
            return {
                ...state,
                employee: action.employee.content.employee,
                employeeContact: action.employee.content.employeeContact
            };
        case constants.GETINFORMATIONEMPLOYEE_FAILURE:
            return {
                error: action.error
            };
        case constants.UPDATE_INFORMATION_REQUEST:
            return {
                ...state,
                updatting: true
            };
        case constants.UPDATE_INFORMATION_SUCCESS:
            return {
                ...state,
                content: action.informationEmployee.content
            };
        case constants.UPDATE_INFORMATION_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}