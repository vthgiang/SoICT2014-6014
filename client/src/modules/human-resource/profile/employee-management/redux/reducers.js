import {
    EmployeeConstants
} from './constants';
const initState = {
    isLoading: false,
    totalList: '',
    listEmployee: '',
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
        case EmployeeConstants.UPLOAD_AVATAR_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.UPLOAD_AVATAR_SUCCESS:
            return {
                ...state,
                avatarfile: action.payload,
                    isLoading: false
            };
        case EmployeeConstants.UPLOAD_AVATAR_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case EmployeeConstants.UPDATE_CONTRACT_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.UPDATE_CONTRACT_SUCCESS:
            return {
                ...state,
                updateContract: action.file.content,
                    isLoading: false
            };
        case EmployeeConstants.UPDATE_CONTRACT_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };

        case EmployeeConstants.UPDATE_CERTIFICATE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.UPDATE_CERTIFICATE_SUCCESS:
            return {
                ...state,
                updateCertificate: action.file.content,
                    isLoading: false
            };
        case EmployeeConstants.UPDATE_CERTIFICATE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case EmployeeConstants.UPDATE_CERTIFICATESHORT_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.UPDATE_CERTIFICATESHORT_SUCCESS:
            return {
                ...state,
                updateCertificateShort: action.file.content,
                    isLoading: false
            };
        case EmployeeConstants.UPDATE_CERTIFICATESHORT_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case EmployeeConstants.UPDATE_FILE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.UPDATE_FILE_SUCCESS:
            return {
                ...state,
                updateFile: action.file.content,
                    isLoading: false
            };
        case EmployeeConstants.UPDATE_FILE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case EmployeeConstants.CHECK_EMPLOYEENUMBER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.CHECK_EMPLOYEENUMBER_SUCCESS:
            return {
                ...state,
                checkMSNV: action.checkMSNV.content,
                    isLoading: false
            };
        case EmployeeConstants.CHECK_EMPLOYEENUMBER_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case EmployeeConstants.CHECK_EMAILCOMPANY_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.CHECK_EMAILCOMPANY_SUCCESS:
            return {
                ...state,
                checkEmail: action.checkEmail.content,
                    isLoading: false
            };
        case EmployeeConstants.CHECK_EMAILCOMPANY_FAILURE:
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

        case EmployeeConstants.CHECK_ARRAY_EMPLOYEENUMBER_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case EmployeeConstants.CHECK_ARRAY_EMPLOYEENUMBER_SUCCESS:
            return {
                ...state,
                checkArrayMSNV: [...action.checkArrayMSNV.content],
                    isLoading: false
            };
        case EmployeeConstants.CHECK_ARRAY_EMPLOYEENUMBER_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        default:
            return state
    }
}