import {
    Constants
} from './constants';

export function employeesInfo(state = {}, action) {
    switch (action.type) {
        case Constants.GET_INFOR_PERSONAL_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case Constants.GET_INFOR_PERSONAL_SUCCESS:
            return {
                ...state,
                isloading: false,
                employee: action.employee.content.employee,
                    employeeContact: action.employee.content.employeeContact,
                    salary: action.employee.content.salary,
                    sabbatical: action.employee.content.sabbatical,
                    praise: action.employee.content.praise,
                    discipline: action.employee.content.discipline
            };
        case Constants.GET_INFOR_PERSONAL_FAILURE:
            return {
                error: action.error
            };
        case Constants.UPDATE_INFOR_PERSONAL_REQUEST:
            return {
                ...state,
                isloading: true
            };
        case Constants.UPDATE_INFOR_PERSONAL_SUCCESS:
            return {
                ...state,
                isloading: false,
                infoEmployeeUpdate: action.informationEmployee.content
            };
        case Constants.UPDATE_INFOR_PERSONAL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}