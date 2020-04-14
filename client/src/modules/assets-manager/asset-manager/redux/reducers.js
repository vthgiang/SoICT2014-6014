import {
    AssetConstants
} from './constants';
const initState = {
    checkArrayMSNV: []
}
export function asset(state = initState, action) {
    switch (action.type) {
        case AssetConstants.GETALL_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.GETALL_SUCCESS:
            return {
                ...state,
                allEmployee: action.employees.content.data,
                    totalList: action.employees.content.totalList,
                    isLoading: false
            };
        case AssetConstants.GETALL_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.ADDEMPLOYEE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.ADDEMPLOYEE_SUCCESS:
            return {
                ...state,
                newEmployee: action.employee,
                isLoading: false
            };
        case AssetConstants.ADDEMPLOYEE_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.UPDATE_INFOR_EMPLOYEE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPDATE_INFOR_EMPLOYEE_SUCCESS:
            return {
                ...state,
                infoEmployeeUpdate: action.informationEmployee.content,
                isLoading: false
            };
        case AssetConstants.UPDATE_INFOR_EMPLOYEE_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.UPLOAD_AVATAR_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPLOAD_AVATAR_SUCCESS:
            return {
                ...state,
                avatarfile: action.file.content,
                isLoading: false
            };
        case AssetConstants.UPLOAD_AVATAR_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.UPDATE_CONTRACT_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPDATE_CONTRACT_SUCCESS:
            return {
                ...state,
                updateContract: action.file.content,
                isLoading: false
            };
        case AssetConstants.UPDATE_CONTRACT_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };

        case AssetConstants.UPDATE_CERTIFICATE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPDATE_CERTIFICATE_SUCCESS:
            return {
                ...state,
                updateCertificate: action.file.content,
                isLoading: false
            };
        case AssetConstants.UPDATE_CERTIFICATE_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.UPDATE_CERTIFICATESHORT_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPDATE_CERTIFICATESHORT_SUCCESS:
            return {
                ...state,
                updateCertificateShort: action.file.content,
                isLoading: false
            };
        case AssetConstants.UPDATE_CERTIFICATESHORT_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.UPDATE_FILE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.UPDATE_FILE_SUCCESS:
            return {
                ...state,
                updateFile: action.file.content,
                isLoading: false
            };
        case AssetConstants.UPDATE_FILE_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.CHECK_EMPLOYEENUMBER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.CHECK_EMPLOYEENUMBER_SUCCESS:
            return {
                ...state,
                checkMSNV: action.checkMSNV.content,
                isLoading: false
            };
        case AssetConstants.CHECK_EMPLOYEENUMBER_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case AssetConstants.CHECK_EMAILCOMPANY_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.CHECK_EMAILCOMPANY_SUCCESS:
            return {
                ...state,
                checkEmail: action.checkEmail.content,
                isLoading: false
            };
        case AssetConstants.CHECK_EMAILCOMPANY_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };

        case AssetConstants.DELETE_EMPLOYEE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case AssetConstants.DELETE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                allEmployee: state.allEmployee.filter(list => (list.employee[0]._id !== action.employeeDelete.content.infoEmployee._id)),
                    isLoading: false,
            };
        case AssetConstants.DELETE_EMPLOYEE_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };

        case AssetConstants.CHECK_ARRAY_EMPLOYEENUMBER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case AssetConstants.CHECK_ARRAY_EMPLOYEENUMBER_SUCCESS:
            return {
                ...state,
                checkArrayMSNV: [...action.checkArrayMSNV.content],
                isLoading: false
            };
        case AssetConstants.CHECK_ARRAY_EMPLOYEENUMBER_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        default:
            return state
    }
}