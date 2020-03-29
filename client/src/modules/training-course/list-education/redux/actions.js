import {
    EducationConstants
} from "./constants";
import {
    EducationService
} from "./services";
export const EducationActions = {
    getListEducation,
    createNewEducation,
    deleteEducation,
    updateEducation,
};

// lấy danh sách các chương trình đào tạo bắt buộc
function getListEducation(data) {
    return dispatch => {
        dispatch(request());

        EducationService.getListEducation(data)
            .then(
                listEducation => dispatch(success(listEducation)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: EducationConstants.GET_LISTEDUCATION_REQUEST,
        };
    };

    function success(listEducation) {
        return {
            type: EducationConstants.GET_LISTEDUCATION_SUCCESS,
            listEducation
        };
    };

    function failure(error) {
        return {
            type: EducationConstants.GET_LISTEDUCATION_FAILURE,
            error
        };
    };
}

// tạo mới chương trình đào tạo bắt buộc
function createNewEducation(newEducation){
    return dispatch => {
        dispatch(request(newEducation));

        EducationService.createNewEducation(newEducation)
            .then(
                newEducation => dispatch(success(newEducation)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(newEducation) {
        return {
            type: EducationConstants.CREATE_EDUCATION_REQUEST,
            newEducation
        };
    };

    function success(newEducation) {
        return {
            type: EducationConstants.CREATE_EDUCATION_SUCCESS,
            newEducation
        };
    };

    function failure(error) {
        return {
            type: EducationConstants.CREATE_EDUCATION_FAILURE,
            error
        };
    };
}

// Xoá một chương trình đào tạo
function deleteEducation(id){
    return dispatch => {
        dispatch(request());

        EducationService.deleteEducation(id)
            .then(
                deleteEducation => dispatch(success(deleteEducation)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: EducationConstants.DELETE_EDUCATION_REQUEST,
        };
    };

    function success(deleteEducation) {
        return {
            type: EducationConstants.DELETE_EDUCATION_SUCCESS,
            deleteEducation
        };
    };

    function failure(error) {
        return {
            type: EducationConstants.DELETE_EDUCATION_FAILURE,
            error
        };
    };
}

// cập nhật thông tin của chương trình đào tạo
function updateEducation(id, infoEducation){
    return dispatch => {
        dispatch(request());

        EducationService.updateEducation(id, infoEducation)
            .then(
                updateEducation => dispatch(success(updateEducation)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: EducationConstants.UPDATE_EDUCATION_REQUEST,
        };
    };

    function success(updateEducation) {
        return {
            type: EducationConstants.UPDATE_EDUCATION_SUCCESS,
            updateEducation
        };
    };

    function failure(error) {
        return {
            type: EducationConstants.UPDATE_EDUCATION_FAILURE,
            error
        };
    };
}
