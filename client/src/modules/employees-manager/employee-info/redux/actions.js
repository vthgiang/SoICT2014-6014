import {
    constants
} from "./constants";
//import { alerActions } from "./AlertActions";
import {
    employeeService
} from "./services";
export const employeeInfoActions = {
    addNewEmployee,
    getInformationEmployee,
    updateInformationEmployee,
    uploadAvatar,
};

// upload ảnh đại diện
function uploadAvatar(file) {
    return dispatch => {
        dispatch(request());
        employeeService.uploadAvatar(file)
            .then(
                file => dispatch(success(file)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: constants.ULOAD_AVATAR_REQUEST,
        };
    };

    function success(fileUpload) {
        return {
            type: constants.ULOAD_AVATAR_SUCCESS,
            fileUpload
        };
    };

    function failure(error) {
        return {
            type: constants.ULOAD_AVATAR_FAILURE,
            error
        };
    };
}

// lấy thông tin nhân viên theo mã nhân viên
function getInformationEmployee(id) {
    return dispatch => {
        dispatch(request());

        employeeService.getByEmployeeNumber(id)
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

// Tạo mới một nhân viên mới
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

// update thông tin của một nhân viên

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