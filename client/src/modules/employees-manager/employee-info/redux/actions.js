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
    updateContract,
    updateCertificate,
    updateCertificateShort,
    updateFile,
};

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
            type: Constants.UPLOAD_AVATAR_REQUEST,
        };
    };

    function success(file) {
        return {
            type: Constants.UPLOAD_AVATAR_SUCCESS,
            file
        };
    };

    function failure(error) {
        return {
            type: Constants.UPLOAD_AVATAR_FAILURE,
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
            type: Constants.UPDATE_CONTRACT_REQUEST,
        };
    };
    function success(file) {
        return {
            type: Constants.UPDATE_CONTRACT_SUCCESS,
            file
        };
    };
    function failure(error) {
        return {
            type: Constants.UPDATE_CONTRACT_FAILURE,
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
            type: Constants.UPDATE_CERTIFICATE_REQUEST,
        };
    };
    function success(file) {
        return {
            type: Constants.UPDATE_CERTIFICATE_SUCCESS,
            file
        };
    };
    function failure(error) {
        return {
            type: Constants.UPDATE_CERTIFICATE_FAILURE,
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
            type: Constants.UPDATE_CERTIFICATESHORT_REQUEST,
        };
    };
    function success(file) {
        return {
            type: Constants.UPDATE_CERTIFICATESHORT_SUCCESS,
            file
        };
    };
    function failure(error) {
        return {
            type: Constants.UPDATE_CERTIFICATESHORT_FAILURE,
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
            type: Constants.UPDATE_FILE_REQUEST,
        };
    };
    function success(file) {
        return {
            type: Constants.UPDATE_FILE_SUCCESS,
            file
        };
    };
    function failure(error) {
        return {
            type: Constants.UPDATE_FILE_FAILURE,
            error
        };
    };
}