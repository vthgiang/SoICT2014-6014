import {
    Constants
} from './constants';

export function employeesInfo(state = {}, action) {
    switch (action.type) {
        case Constants.ADDEMPLOYEE_REQUEST:
            return {
                ...state,
                adding: true
            };
        case Constants.ADDEMPLOYEE_SUCCESS:
            return {
                ...state,
                newEmployee: action.employee
            };
        case Constants.ADDEMPLOYEE_FAILURE:
            return {
                error: action.error
            };
        case Constants.GETINFORMATIONEMPLOYEE_REQUEST:
            return {
                ...state,
                loadding: true
            };
        case Constants.GETINFORMATIONEMPLOYEE_SUCCESS:
            return {
                ...state,
                employee: action.employee.content.employee,
                    employeeContact: action.employee.content.employeeContact
            };
        case Constants.GETINFORMATIONEMPLOYEE_FAILURE:
            return {
                error: action.error
            };
        case Constants.UPDATE_INFORMATION_REQUEST:
            return {
                ...state,
                updatting: true
            };
        case Constants.UPDATE_INFORMATION_SUCCESS:
            return {
                ...state,
                infoEmployeeUpdate: action.informationEmployee.content
            };
        case Constants.UPDATE_INFORMATION_FAILURE:
            return {
                error: action.error
            };
        case Constants.ULOAD_AVATAR_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case Constants.ULOAD_AVATAR_SUCCESS:
            return {
                ...state,
                avatarfile: action.file.content
            };
        case Constants.ULOAD_AVATAR_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}