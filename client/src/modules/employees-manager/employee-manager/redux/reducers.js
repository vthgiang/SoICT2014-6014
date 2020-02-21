import {
    EmployeeConstants
} from './constants';

export function employeesManager(state = {}, action) {
    switch (action.type) {
        case EmployeeConstants.GETALL_REQUEST:
            return {
                ...state,
                loadingMany: true
            };
        case EmployeeConstants.GETALL_SUCCESS:
            return {
                ...state,
                allEmployee: action.employees.content.allEmployee
            };
        case EmployeeConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case EmployeeConstants.ADDEMPLOYEE_REQUEST:
            return {
                ...state,
                adding: true
            };
        case EmployeeConstants.ADDEMPLOYEE_SUCCESS:
            return {
                ...state,
                newEmployee: action.employee
            };
        case EmployeeConstants.ADDEMPLOYEE_FAILURE:
            return {
                error: action.error
            };
        case EmployeeConstants.UPLOAD_AVATAR_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case EmployeeConstants.UPLOAD_AVATAR_SUCCESS:
            return {
                ...state,
                avatarfile: action.file.content
            };
        case EmployeeConstants.UPLOAD_AVATAR_FAILURE:
            return {
                error: action.error
            };
        case EmployeeConstants.UPDATE_CONTRACT_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case EmployeeConstants.UPDATE_CONTRACT_SUCCESS:
            return {
                ...state,
                updateContract: action.file.content
            };
        case EmployeeConstants.UPDATE_CONTRACT_FAILURE:
            return {
                error: action.error
            };

        case EmployeeConstants.UPDATE_CERTIFICATE_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case EmployeeConstants.UPDATE_CERTIFICATE_SUCCESS:
            return {
                ...state,
                updateCertificate: action.file.content
            };
        case EmployeeConstants.UPDATE_CERTIFICATE_FAILURE:
            return {
                error: action.error
            };
        case EmployeeConstants.UPDATE_CERTIFICATESHORT_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case EmployeeConstants.UPDATE_CERTIFICATESHORT_SUCCESS:
            return {
                ...state,
                updateCertificateShort: action.file.content
            };
        case EmployeeConstants.UPDATE_CERTIFICATESHORT_FAILURE:
            return {
                error: action.error
            };
        case EmployeeConstants.UPDATE_FILE_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case EmployeeConstants.UPDATE_FILE_SUCCESS:
            return {
                ...state,
                updateFile: action.file.content
            };
        case EmployeeConstants.UPDATE_FILE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}