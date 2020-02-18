import {
    SalaryConstants
} from './constants';

export function Salary(state = {listSalary:[]}, action) {
    switch (action.type) {
        case SalaryConstants.GET_SALARY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SalaryConstants.GET_SALARY_SUCCESS:
            return {
                ...state,
                listSalary: action.listSalary.content,
                    isLoading: false,
            };
        case SalaryConstants.GET_SALARY_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case SalaryConstants.CREATE_SALARY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SalaryConstants.CREATE_SALARY_SUCCESS:
            return {
                ...state,
                listSalary: [
                        ...state.listSalary,
                        action.newSalary.content
                    ],
                    isLoading: false,
            };
        case SalaryConstants.CREATE_SALARY_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case SalaryConstants.DELETE_SALARY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SalaryConstants.DELETE_SALARY_SUCCESS:
            return {
                ...state,
                listSalary: state.listSalary.filter(Salary => (Salary._id !== action.salaryDelete.content._id)),
                    isLoading: false,
            };
        case SalaryConstants.DELETE_SALARY_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case SalaryConstants.UPDATE_SALARY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SalaryConstants.UPDATE_SALARY_SUCCESS:
            return {
                ...state,
                listSalary: state.listSalary.map(Salary =>
                        Salary._id === action.infoSalary.content._id ?
                        action.infoSalary.content : Salary
                    ),
                    isLoading: false,
            };
        case SalaryConstants.UPDATE_SALARY_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };

        default:
            return state
    }
}