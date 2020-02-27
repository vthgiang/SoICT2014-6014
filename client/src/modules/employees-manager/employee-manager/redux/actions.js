import {
    EmployeeConstants
} from "./constants";
//import { alerActions } from "./AlertActions";
import {
    EmployeeService
} from "./services";
export const EmployeeManagerActions = {
    getAllEmployee,
    addNewEmployee,
    uploadAvatar,
    updateContract,
    updateCertificate,
    updateCertificateShort,
    updateFile,
    updateInformationEmployee,
    checkMSNV,
    checkEmail

};

// Lấy danh sách nhân viên
function getAllEmployee(data) {
    return dispatch => {
        dispatch(request());

        EmployeeService.getAll(data)
            .then(
                employees => dispatch(success(employees)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {
            type: EmployeeConstants.GETALL_REQUEST
        };
    };

    function success(employees) {
        return {
            type: EmployeeConstants.GETALL_SUCCESS,
            employees
        };
    };

    function failure(error) {
        return {
            type: EmployeeConstants.GETALL_FAILURE,
            error
        };
    };
}

// Kiểm tra sự tồn tại của MSNV
function checkMSNV(employeeNumber) {
    return dispatch => {
        dispatch(request());
        EmployeeService.checkMSNV(employeeNumber)
            .then(
                checkMSNV => dispatch(success(checkMSNV)),
                error => dispatch(failure(error.toString()))
            );
    };
    function request() {
        return {
            type: EmployeeConstants.CHECK_EMPLOYEENUMBER_REQUEST
        };
    };

    function success(checkMSNV) {
        return {
            type: EmployeeConstants.CHECK_EMPLOYEENUMBER_SUCCESS,
            checkMSNV
        };
    };

    function failure(error) {
        return {
            type: EmployeeConstants.CHECK_EMPLOYEENUMBER_FAILURE,
            error
        };
    };
}

// Kiểm tra sự tồn tại của email công ty
function checkEmail(email) {
    return dispatch => {
        dispatch(request());
        EmployeeService.checkEmail(email)
            .then(
                checkEmail => dispatch(success(checkEmail)),
                error => dispatch(failure(error.toString()))
            );
    };
    function request() {
        return {
            type: EmployeeConstants.CHECK_EMAILCOMPANY_REQUEST,
        };
    };

    function success(checkEmail) {
        return {
            type: EmployeeConstants.CHECK_EMAILCOMPANY_SUCCESS,
            checkEmail
        };
    };

    function failure(error) {
        return {
            type: EmployeeConstants.CHECK_EMAILCOMPANY_FAILURE,
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
            type: EmployeeConstants.ADDEMPLOYEE_REQUEST,
            employee
        }
    };

    function success(employee) {
        return {
            type: EmployeeConstants.ADDEMPLOYEE_SUCCESS,
            employee
        }
    };

    function failure(error) {
        return {
            type: EmployeeConstants.ADDEMPLOYEE_FAILURE,
            error
        }
    };
}

// update thông tin nhân viên theo id
function updateInformationEmployee(id,informationEmployee) {
    return dispatch => {
        dispatch(request());

        EmployeeService.updateInformationEmployee(id,informationEmployee)
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

// upload ảnh đại diện
function uploadAvatar(employeeNumber,fileUpload) {
    return dispatch => {
        dispatch(request());
        EmployeeService.uploadAvatar(employeeNumber,fileUpload)
            .then(
                file => dispatch(success(file)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: EmployeeConstants.UPLOAD_AVATAR_REQUEST,
        };
    };

    function success(file) {
        return {
            type: EmployeeConstants.UPLOAD_AVATAR_SUCCESS,
            file
        };
    };

    function failure(error) {
        return {
            type: EmployeeConstants.UPLOAD_AVATAR_FAILURE,
            error
        };
    };
}

// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
function updateContract(employeeNumber,fileUpload) {
    return dispatch => {
        dispatch(request());
        EmployeeService.updateContract(employeeNumber,fileUpload)
            .then(
                file => dispatch(success(file)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: EmployeeConstants.UPDATE_CONTRACT_REQUEST,
        };
    };
    function success(file) {
        return {
            type: EmployeeConstants.UPDATE_CONTRACT_SUCCESS,
            file
        };
    };
    function failure(error) {
        return {
            type: EmployeeConstants.UPDATE_CONTRACT_FAILURE,
            error
        };
    };
}

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
function updateCertificate(employeeNumber,fileUpload) {
    return dispatch => {
        dispatch(request());
        EmployeeService.updateCertificate(employeeNumber,fileUpload)
            .then(
                file => dispatch(success(file)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: EmployeeConstants.UPDATE_CERTIFICATE_REQUEST,
        };
    };
    function success(file) {
        return {
            type: EmployeeConstants.UPDATE_CERTIFICATE_SUCCESS,
            file
        };
    };
    function failure(error) {
        return {
            type: EmployeeConstants.UPDATE_CERTIFICATE_FAILURE,
            error
        };
    };
}

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
function updateCertificateShort(employeeNumber,fileUpload) {
    return dispatch => {
        dispatch(request());
        EmployeeService.updateCertificateShort(employeeNumber,fileUpload)
            .then(
                file => dispatch(success(file)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: EmployeeConstants.UPDATE_CERTIFICATESHORT_REQUEST,
        };
    };
    function success(file) {
        return {
            type: EmployeeConstants.UPDATE_CERTIFICATESHORT_SUCCESS,
            file
        };
    };
    function failure(error) {
        return {
            type: EmployeeConstants.UPDATE_CERTIFICATESHORT_FAILURE,
            error
        };
    };
}

// Cập nhật(thêm) thông tin tài liệu đính kèm theo MSNV
function updateFile(employeeNumber,fileUpload) {
    return dispatch => {
        dispatch(request());
        EmployeeService.updateFile(employeeNumber,fileUpload)
            .then(
                file => dispatch(success(file)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: EmployeeConstants.UPDATE_FILE_REQUEST,
        };
    };
    function success(file) {
        return {
            type: EmployeeConstants.UPDATE_FILE_SUCCESS,
            file
        };
    };
    function failure(error) {
        return {
            type: EmployeeConstants.UPDATE_FILE_FAILURE,
            error
        };
    };
}