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
    checkSalary,
    checkArraySalary,
    importSalary
};

// lấy danh sách bảng lương
function getListSalary(data) {
    return dispatch => {
        dispatch(request());

        SalaryService.getListSalary(data)
            .then(
                listSalary => dispatch(success(listSalary)),
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
function createNewSalary(newSalary) {
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
function deleteSalary(id) {
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
function updateSalary(id, infoSalary) {
    return dispatch => {
        dispatch(request());

        SalaryService.updateSalary(id, infoSalary)
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

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương
function checkSalary(employeeNumber, month) {
    return dispatch => {
        dispatch(request());
        SalaryService.checkSalary(employeeNumber, month)
            .then(
                checkSalary => dispatch(success(checkSalary)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: SalaryConstants.CHECK_SALARY_REQUEST
        };
    };

    function success(checkSalary) {
        return {
            type: SalaryConstants.CHECK_SALARY_SUCCESS,
            checkSalary
        };
    };

    function failure(error) {
        return {
            type: SalaryConstants.CHECK_SALARY_FAILURE,
            error
        };
    };
}

// Kiểm tra sự tồn tại của bảng lương nhân viên theo tháng lương trong array
function checkArraySalary(arraySalary) {
    return dispatch => {
        dispatch(request());
        SalaryService.checkArraySalary(arraySalary)
            .then(
                checkArraySalary => dispatch(success(checkArraySalary)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: SalaryConstants.CHECK_ARRAY_SALARY_REQUEST
        };
    };

    function success(checkArraySalary) {
        return {
            type: SalaryConstants.CHECK_ARRAY_SALARY_SUCCESS,
            checkArraySalary
        };
    };

    function failure(error) {
        return {
            type: SalaryConstants.CHECK_ARRAY_SALARY_FAILURE,
            error
        };
    };
}

// Import lương nhân viên
function importSalary(data) {
    return dispatch => {
        dispatch(request());
        SalaryService.importSalary(data)
            .then(
                importSalary => dispatch(success(importSalary)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: SalaryConstants.IMPORT_SALARY_REQUEST
        };
    };

    function success(importSalary) {
        return {
            type: SalaryConstants.IMPORT_SALARY_SUCCESS,
            importSalary
        };
    };

    function failure(error) {
        return {
            type: SalaryConstants.IMPORT_SALARY_FAILURE,
            error
        };
    };
}
