import {
    CourseConstants
} from "./constants";
import {
    CourseService
} from "./services";
export const CourseActions = {
    getListCourse,
    getCourseByEducation,
    createNewCourse,
    deleteCourse,
    updateCourse,
};

// lấy danh sách các khoá đào tạo
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

// lấy danh sách các khoá đào tạo theo chương trinh đào tạo
function getCourseByEducation(data) {
    return dispatch => {
        dispatch(request());

        CourseService.getCourseByEducation(data)
            .then(
                CourseByEducation => dispatch(success(CourseByEducation)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: CourseConstants.GET_COURSE_BY_EDUCATION_REQUEST,
        };
    };

    function success(CourseByEducation) {
        return {
            type: CourseConstants.GET_COURSE_BY_EDUCATION_SUCCESS,
            CourseByEducation
        };
    };

    function failure(error) {
        return {
            type: CourseConstants.GET_COURSE_BY_EDUCATION_FAILURE,
            error
        };
    };
}



// tạo mới khoá đào tạo
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

// Xoá một khoá đào tạo
function deleteCourse(id){
    return dispatch => {
        dispatch(request());

        CourseService.deleteCourse(id)
            .then(
                deleteCourse => dispatch(success(deleteCourse)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: CourseConstants.DELETE_COURSE_REQUEST,
        };
    };

    function success(deleteCourse) {
        return {
            type: CourseConstants.DELETE_COURSE_SUCCESS,
            deleteCourse
        };
    };

    function failure(error) {
        return {
            type: CourseConstants.DELETE_COURSE_FAILURE,
            error
        };
    };
}

// cập nhật thông tin của khoá đào tạo
function updateCourse(id, infoCourse){
    return dispatch => {
        dispatch(request());

        CourseService.updateCourse(id, infoCourse)
            .then(
                updateCourse => dispatch(success(updateCourse)),
                error => dispatch(failure(error.toString()))
            );
    }

    function request() {
        return {
            type: CourseConstants.UPDATE_COURSE_REQUEST,
        };
    };

    function success(updateCourse) {
        return {
            type: CourseConstants.UPDATE_COURSE_SUCCESS,
            updateCourse
        };
    };

    function failure(error) {
        return {
            type: CourseConstants.UPDATE_COURSE_FAILURE,
            error
        };
    };
}
