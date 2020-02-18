import {
    Constants
} from "./constants";
//import { alerActions } from "./AlertActions";
import {
    EmployeeService
} from "./services";
export const EmployeeInfoActions = {
    addNewEmployee,
    getInformationEmployee,
    updateInformationEmployee,
    uploadAvatar,
};

// upload ảnh đại diện
function uploadAvatar(employeeNumber,file) {
    return dispatch => {
        dispatch(request());
        EmployeeService.uploadAvatar(employeeNumber,file)
            .then(
                file => dispatch(success(file)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: Constants.ULOAD_AVATAR_REQUEST,
        };
    };

    function success(file) {
        return {
            type: Constants.ULOAD_AVATAR_SUCCESS,
            file
        };
    };

    function failure(error) {
        return {
            type: Constants.ULOAD_AVATAR_FAILURE,
            error
        };
    };
}

// lấy thông tin nhân viên theo mã nhân viên
function getInformationEmployee(id) {
    return dispatch => {
        dispatch(request());

        EmployeeService.getByEmployeeNumber(id)
            .then(
                employee => dispatch(success(employee)),
                error => dispatch(failure(error.toString()))

            );
    }

    function request() {
        return {
            type: Constants.GETINFORMATIONEMPLOYEE_REQUEST,
        };
    };

    function success(employee) {
        return {
            type: Constants.GETINFORMATIONEMPLOYEE_SUCCESS,
            employee
        };
    };

    function failure(error) {
        return {
            type: Constants.GETINFORMATIONEMPLOYEE_FAILURE,
            error
        };
    };
}

// Tạo mới một nhân viên mới
function addNewEmployee(employee) {
    return dispatch => {
        dispatch(request(employee));

        EmployeeService.addNewEmployee(employee)
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
            type: Constants.ADDEMPLOYEE_REQUEST,
            employee
        }
    };

    function success(employee) {
        return {
            type: Constants.ADDEMPLOYEE_SUCCESS,
            employee
        }
    };

    function failure(error) {
        return {
            type: Constants.ADDEMPLOYEE_FAILURE,
            error
        }
    };
}

// update thông tin của một nhân viên

function updateInformationEmployee(id, informationEmployee) {
    return dispatch => {
        dispatch(request(informationEmployee));

        EmployeeService.updateInformationEmpoyee(id, informationEmployee)
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
            type: Constants.UPDATE_INFORMATION_REQUEST,
            informationEmployee
        }
    };

    function success(informationEmployee) {
        return {
            type: Constants.UPDATE_INFORMATION_SUCCESS,
            informationEmployee
        }
    };

    function failure(error) {
        return {
            type: Constants.GETINFORMATIONEMPLOYEE_FAILURE,
            error
        }
    };

}