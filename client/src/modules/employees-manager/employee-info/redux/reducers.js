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
        case Constants.UPLOAD_AVATAR_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case Constants.UPLOAD_AVATAR_SUCCESS:
            return {
                ...state,
                avatarfile: action.file.content
            };
        case Constants.UPLOAD_AVATAR_FAILURE:
            return {
                error: action.error
            };
        case Constants.UPDATE_CONTRACT_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case Constants.UPDATE_CONTRACT_SUCCESS:
            return {
                ...state,
                updateContract: action.file.content
            };
        case Constants.UPDATE_CONTRACT_FAILURE:
            return {
                error: action.error
            };

        case Constants.UPDATE_CERTIFICATE_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case Constants.UPDATE_CERTIFICATE_SUCCESS:
            return {
                ...state,
                updateCertificate: action.file.content
            };
        case Constants.UPDATE_CERTIFICATE_FAILURE:
            return {
                error: action.error
            };
        case Constants.UPDATE_CERTIFICATESHORT_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case Constants.UPDATE_CERTIFICATESHORT_SUCCESS:
            return {
                ...state,
                updateCertificateShort: action.file.content
            };
        case Constants.UPDATE_CERTIFICATESHORT_FAILURE:
            return {
                error: action.error
            };
        case Constants.UPDATE_FILE_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case Constants.UPDATE_FILE_SUCCESS:
            return {
                ...state,
                updateFile: action.file.content
            };
        case Constants.UPDATE_FILE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}