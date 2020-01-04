import {
    constants
} from "./constants";
//import { alerActions } from "./AlertActions";
import {
    employeeService
} from "./services";
export const employeeActions = {
    addNewEmployee,
    getInformationEmployee,
    updateInformationEmployee,
};

// get information employee by employeeNumber
function getInformationEmployee(employeeNumber) {
    return dispatch => {
        dispatch(request());

        employeeService.getByEmployeeNumber(employeeNumber)
            .then(
                employee => dispatch(success(employee)),
                error => dispatch(failure(error.toString()))

            );
    }

    function request() {
        return {
            type: constants.GETINFORMATIONEMPLOYEE_REQUEST,
        };
    };

    function success(employee) {
        return {
            type: constants.GETINFORMATIONEMPLOYEE_SUCCESS,
            employee
        };
    };

    function failure(error) {
        return {
            type: constants.GETINFORMATIONEMPLOYEE_FAILURE,
            error
        };
    };
}

// create a new employee
function addNewEmployee(employee) {
    return dispatch => {
        dispatch(request(employee));

        employeeService.addNewEmployee(employee)
            .then(
                employee => {
                    dispatch(success(employee));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(employee) {
        return {
            type: constants.ADDEMPLOYEE_REQUEST,
            employee
        }
    };

    function success(employee) {
        return {
            type: constants.ADDEMPLOYEE_SUCCESS,
            employee
        }
    };

    function failure(error) {
        return {
            type: constants.ADDEMPLOYEE_FAILURE,
            error
        }
    };
}

// update information employee

function updateInformationEmployee(id, informationEmployee) {
    return dispatch => {
        dispatch(request(informationEmployee));

        employeeService.updateInformationEmpoyee(id, informationEmployee)
            .then(
                informationEmployee => {
                    dispatch(success(informationEmployee));
                },
                error => {
                    dispatch(failure(error).toString());
                }
            );
    };

    function request(informationEmployee) {
        return {
            type: constants.UPDATE_INFORMATION_REQUEST,
            informationEmployee
        }
    };

    function success(informationEmployee) {
        return {
            type: constants.UPDATE_INFORMATION_SUCCESS,
            informationEmployee
        }
    };

    function failure(error) {
        return {
            type: constants.GETINFORMATIONEMPLOYEE_FAILURE,
            error
        }
    };

}