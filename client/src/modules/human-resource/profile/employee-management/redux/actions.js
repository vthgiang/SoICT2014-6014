import {
    EmployeeConstants
} from "./constants";
import {
    EmployeeService
} from "./services";
export const EmployeeManagerActions = {
    getAllEmployee,
    addNewEmployee,
    updateInformationEmployee,
    deleteEmployee,
};

// Lấy danh sách nhân viên
function getAllEmployee(data) {
    return dispatch => {
        dispatch({
            type: EmployeeConstants.GETALL_REQUEST
        });
        EmployeeService.getAll(data)
            .then(res => {
                dispatch({
                    type: EmployeeConstants.GETALL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EmployeeConstants.GETALL_FAILURE,
                    error: err.response.data
                });
            })
    };
}

// Tạo mới một nhân viên mới
function addNewEmployee(employee) {
    return dispatch => {
        dispatch({
            type: EmployeeConstants.ADDEMPLOYEE_REQUEST
        });

        EmployeeService.addNewEmployee(employee)
            .then(res => {
                dispatch({
                    type: EmployeeConstants.ADDEMPLOYEE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EmployeeConstants.ADDEMPLOYEE_FAILURE,
                    error: err.response.data
                });
            })
    };
}

// update thông tin nhân viên theo id
function updateInformationEmployee(id, informationEmployee) {
    return dispatch => {
        dispatch(request());

        EmployeeService.updateInformationEmployee(id, informationEmployee)
            .then(
                informationEmployee => {
                    dispatch(success(informationEmployee));
                },
                error => {
                    dispatch(failure(error).toString());
                }
            );
    };

    function request() {
        return {
            type: EmployeeConstants.UPDATE_INFOR_EMPLOYEE_REQUEST,
        }
    };

    function success(informationEmployee) {
        return {
            type: EmployeeConstants.UPDATE_INFOR_EMPLOYEE_SUCCESS,
            informationEmployee
        }
    };

    function failure(error) {
        return {
            type: EmployeeConstants.UPDATE_INFOR_EMPLOYEE_FAILURE,
            error
        }
    };

}

// Xoá thông tin nhân viên
function deleteEmployee(id) {
    return dispatch => {
        dispatch({
            type: EmployeeConstants.DELETE_EMPLOYEE_REQUEST
        });

        EmployeeService.deleteEmployee(id)
            .then(res => {
                dispatch({
                    type: EmployeeConstants.DELETE_EMPLOYEE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: EmployeeConstants.DELETE_EMPLOYEE_FAILURE,
                    error: err.response
                });
            })
    }
}
