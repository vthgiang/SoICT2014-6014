import { SalaryConstants } from "./constants";
import { SalaryService } from "./services";
export const SalaryActions = {
    searchSalary,
    createSalary,
    deleteSalary,
    updateSalary,
    checkSalary,
    checkArraySalary,
    importSalary
};

// lấy danh sách bảng lương
function searchSalary(data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.GET_SALARY_REQUEST
        });
        SalaryService.searchSalary(data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.GET_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.GET_SALARY_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// tạo mới bảng lương
function createSalary(data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.CREATE_SALARY_REQUEST
        });
        SalaryService.createNewSalary(data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.CREATE_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.CREATE_SALARY_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Xoá một chương trình đào tạo
function deleteSalary(id) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.DELETE_SALARY_REQUEST
        });
        SalaryService.deleteSalary(id)
            .then(res => {
                dispatch({
                    type: SalaryConstants.DELETE_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.DELETE_SALARY_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Cập nhật thông tin của chương trình đào tạo
function updateSalary(id, data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.UPDATE_SALARY_REQUEST
        });
        SalaryService.updateSalary(id, data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.UPDATE_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.UPDATE_SALARY_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương
function checkSalary(employeeNumber, month) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.CHECK_SALARY_REQUEST
        });
        SalaryService.checkSalary(employeeNumber, month)
            .then(res => {
                dispatch({
                    type: SalaryConstants.CHECK_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.CHECK_SALARY_FAILURE,
                    error: err.response.data
                });
            })
    };
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array
function checkArraySalary(data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.CHECK_ARRAY_SALARY_REQUEST
        });
        SalaryService.checkArraySalary(data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.CHECK_ARRAY_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.CHECK_ARRAY_SALARY_FAILURE,
                    error: err.response.data
                });
            })
    };
}

// Import lương nhân viên
function importSalary(data) {
    return dispatch => {
        dispatch({
            type: SalaryConstants.IMPORT_SALARY_REQUEST
        });
        SalaryService.importSalary(data)
            .then(res => {
                dispatch({
                    type: SalaryConstants.IMPORT_SALARY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: SalaryConstants.IMPORT_SALARY_FAILURE,
                    error: err.response.data
                });
            })
    };
}