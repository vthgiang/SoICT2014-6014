import {
    CourseConstants
} from "./constants";
import {
    CourseService
} from "./services";
export const CourseActions = {
    getListCourse,
    createNewCourse,
    deleteCourse,
    updateCourse,
};

// lấy danh sách các chương trình đào tạo bắt buộc
function getListCourse(data) {
    return dispatch => {
        dispatch(request());

        CourseService.getListCourse(data)
            .then(
                listCourse => dispatch(success(listCourse)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: CourseConstants.GET_LISTCOURSE_REQUEST,
        };
    };

    function success(listCourse) {
        return {
            type: CourseConstants.GET_LISTCOURSE_SUCCESS,
            listCourse
        };
    };

    function failure(error) {
        return {
            type: CourseConstants.GET_LISTCOURSE_FAILURE,
            error
        };
    };
}

// tạo mới chương trình đào tạo bắt buộc
function createNewCourse(newCourse){
    return dispatch => {
        dispatch(request(newCourse));

        CourseService.createNewCourse(newCourse)
            .then(
                newCourse => dispatch(success(newCourse)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(newCourse) {
        return {
            type: CourseConstants.CREATE_COURSE_REQUEST,
            newCourse
        };
    };

    function success(newCourse) {
        return {
            type: CourseConstants.CREATE_COURSE_SUCCESS,
            newCourse
        };
    };

    function failure(error) {
        return {
            type: CourseConstants.CREATE_COURSE_FAILURE,
            error
        };
    };
}

// Xoá một chương trình đào tạo
function deleteCourse(numberEducation){
    return dispatch => {
        dispatch(request(numberEducation));

        CourseService.deleteCourse(numberEducation)
            .then(
                numberEducation => dispatch(success(numberEducation)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(numberEducation) {
        return {
            type: CourseConstants.DELETE_COURSE_REQUEST,
            numberEducation
        };
    };

    function success(numberEducation) {
        return {
            type: CourseConstants.DELETE_COURSE_SUCCESS,
            numberEducation
        };
    };

    function failure(error) {
        return {
            type: CourseConstants.DELETE_COURSE_FAILURE,
            error
        };
    };
}

// cập nhật thông tin của chương trình đào tạo
function updateCourse(numberEducation, infoCourse){
    return dispatch => {
        dispatch(request(numberEducation));

        CourseService.updateCourse(numberEducation, infoCourse)
            .then(
                infoCourse => dispatch(success(infoCourse)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request(numberEducation) {
        return {
            type: CourseConstants.UPDATE_COURSE_REQUEST,
            numberEducation
        };
    };

    function success(infoCourse) {
        return {
            type: CourseConstants.UPDATE_COURSE_SUCCESS,
            infoCourse
        };
    };

    function failure(error) {
        return {
            type: CourseConstants.UPDATE_COURSE_FAILURE,
            error
        };
    };
}
