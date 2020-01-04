import {
    employeeConstants
} from "./constants";
//import { alerActions } from "./AlertActions";
import {
    employeeService
} from "./services";
export const employeeActions = {
    getAllEmployee,
    getListEmployee,
};

// get all list employee
function getAllEmployee() {
    return dispatch => {
        dispatch(request());

        employeeService.getAll()
            .then(
                employees => dispatch(success(employees)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: employeeConstants.GETALL_REQUEST
        };
    };

    function success(employees) {
        return {
            type: employeeConstants.GETALL_SUCCESS,
            employees
        };
    };

    function failure(error) {
        return {
            type: employeeConstants.GETALL_FAILURE,
            error
        };
    };
}

// get list employee
function getListEmployee(nameDepartment, chief, deputy) {
    return dispatch => {
        dispatch(request());

        employeeService.getByNameDepartment(nameDepartment, chief, deputy)
            .then(
                employees => dispatch(success(employees)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: employeeConstants.GETLIST_EMPLOYEE_REQUEST,
        };
    };

    function success(employees) {
        return {
            type: employeeConstants.GETLIST_EMPLOYEE_SUCCESS,
            employees
        };
    };

    function failure(error) {
        return {
            type: employeeConstants.GETLIST_EMPLOYEE_FAILURE,
            error
        };
    };
}