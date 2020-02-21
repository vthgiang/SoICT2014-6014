import {
    Constants
} from "./constants";
//import { alerActions } from "./AlertActions";
import {
    EmployeeService
} from "./services";
export const EmployeeInfoActions = {
    getInformationPersonal,
    updateInformationPersonal,
};

// lấy thông tin nhân viên theo mã nhân viên
function getInformationPersonal() {
    return dispatch => {
        dispatch(request());

        EmployeeService.getInformationPersonal()
            .then(
                employee => dispatch(success(employee)),
                error => dispatch(failure(error.toString()))

            );
    }

    function request() {
        return {
            type: Constants.GET_INFOR_PERSONAL_REQUEST,
        };
    };

    function success(employee) {
        return {
            type: Constants.GET_INFOR_PERSONAL_SUCCESS,
            employee
        };
    };

    function failure(error) {
        return {
            type: Constants.GET_INFOR_PERSONAL_FAILURE,
            error
        };
    };
}

// update thông tin cá nhân
function updateInformationPersonal(informationEmployee) {
    return dispatch => {
        dispatch(request(informationEmployee));

        EmployeeService.updateInformationPersonal(informationEmployee)
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
            type: Constants.UPDATE_INFOR_PERSONAL_REQUEST,
            informationEmployee
        }
    };

    function success(informationEmployee) {
        return {
            type: Constants.UPDATE_INFOR_PERSONAL_SUCCESS,
            informationEmployee
        }
    };

    function failure(error) {
        return {
            type: Constants.UPDATE_INFOR_PERSONAL_FAILURE,
            error
        }
    };

}