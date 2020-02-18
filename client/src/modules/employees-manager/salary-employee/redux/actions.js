import {
    SalaryConstants
} from "./constants";
import {
    SalaryService
} from "./services";
export const SalaryActions = {
    getListSalary,
    createNewSalary,
    deleteSalary,
    updateSalary,
};

// lấy danh sách bảng lương
function getListSalary(data) {
    return dispatch => {
        dispatch(request());

        SalaryService.getListSalary(data)
            .then(
           listSalary      => dispatch(success(listSalary)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: SalaryConstants.GET_SALARY_REQUEST,
        };
    };

    function success(listSalary) {
        return {
            type: SalaryConstants.GET_SALARY_SUCCESS,
            listSalary
        };
    };

    function failure(error) {
        return {
            type: SalaryConstants.GET_SALARY_FAILURE,
            error
        };
    };
}

// tạo mới bảng lương
function createNewSalary(newSalary){
    return dispatch => {
        dispatch(request(newSalary));

        SalaryService.createNewSalary(newSalary)
            .then(
                newSalary => dispatch(success(newSalary)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(newSalary) {
        return {
            type: SalaryConstants.CREATE_SALARY_REQUEST,
            newSalary
        };
    };

    function success(newSalary) {
        return {
            type: SalaryConstants.CREATE_SALARY_SUCCESS,
            newSalary
        };
    };

    function failure(error) {
        return {
            type: SalaryConstants.CREATE_SALARY_FAILURE,
            error
        };
    };
}

// Xoá một chương trình đào tạo
function deleteSalary(id){
    return dispatch => {
        dispatch(request());

        SalaryService.deleteSalary(id)
            .then(
                salaryDelete => dispatch(success(salaryDelete)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: SalaryConstants.DELETE_SALARY_REQUEST
        };
    };

    function success(salaryDelete) {
        return {
            type: SalaryConstants.DELETE_SALARY_SUCCESS,
            salaryDelete
        };
    };

    function failure(error) {
        return {
            type: SalaryConstants.DELETE_SALARY_FAILURE,
            error
        };
    };
}

// cập nhật thông tin của chương trình đào tạo
function updateSalary(id,infoSalary){
    return dispatch => {
        dispatch(request());

        SalaryService.updateSalary(id,infoSalary)
            .then(
                infoSalary => dispatch(success(infoSalary)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: SalaryConstants.UPDATE_SALARY_REQUEST
        };
    };

    function success(infoSalary) {
        return {
            type: SalaryConstants.UPDATE_SALARY_SUCCESS,
            infoSalary
        };
    };

    function failure(error) {
        return {
            type: SalaryConstants.UPDATE_SALARY_FAILURE,
            error
        };
    };
}
