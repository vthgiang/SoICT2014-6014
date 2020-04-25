import { Constants } from "./constants";
import { EmployeeService } from "./services";
export const EmployeeInfoActions = {
    getInformationPersonal,
    updateInformationPersonal,
};

// Lấy thông tin nhân viên theo mã nhân viên
function getInformationPersonal() {
    return dispatch => {
        dispatch({
            type: Constants.GET_INFOR_PERSONAL_REQUEST
        });
        EmployeeService.getInformationPersonal()
            .then(res => {
                dispatch({
                    type: Constants.GET_INFOR_PERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: Constants.GET_INFOR_PERSONAL_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Cập nhật thông tin cá nhân
function updateInformationPersonal(data) {
    return dispatch => {
        dispatch({
            type: Constants.UPDATE_INFOR_PERSONAL_REQUEST
        });
        EmployeeService.updateInformationPersonal(data)
            .then(res => {
                dispatch({
                    type: Constants.UPDATE_INFOR_PERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: Constants.UPDATE_INFOR_PERSONAL_FAILURE,
                    error: err.response.data
                });
            })
    };
}