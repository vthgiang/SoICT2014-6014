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
        dispatch({
            type: CourseConstants.GET_LISTCOURSE_REQUEST
        });

        CourseService.getListCourse(data)
            .then(res => {
                dispatch({
                    type: CourseConstants.GET_LISTCOURSE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.GET_LISTCOURSE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// lấy danh sách các khoá đào tạo theo chương trinh đào tạo
function getCourseByEducation(data) {
    return dispatch => {
        dispatch({
            type: CourseConstants.GET_COURSE_BY_EDUCATION_REQUEST,
        });

        CourseService.getCourseByEducation(data)
            .then(res => {
                dispatch({
                    type: CourseConstants.GET_COURSE_BY_EDUCATION_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.GET_COURSE_BY_EDUCATION_FAILURE,
                    error: err.response.data
                });
            })
    }
}



// tạo mới khoá đào tạo
function createNewCourse(newCourse) {
    return dispatch => {
        dispatch({
            type: CourseConstants.CREATE_COURSE_REQUEST,
        });

        CourseService.createNewCourse(newCourse)
            .then(res => {
                dispatch({
                    type: CourseConstants.CREATE_COURSE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.CREATE_COURSE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// Xoá một khoá đào tạo
function deleteCourse(id) {
    return dispatch => {
        dispatch({
            type: CourseConstants.DELETE_COURSE_REQUEST,
        });

        CourseService.deleteCourse(id)
            .then(res => {
                dispatch({
                    type: CourseConstants.DELETE_COURSE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.DELETE_COURSE_FAILURE,
                    error: err.response.data
                });
            })
    }
}

// cập nhật thông tin của khoá đào tạo
function updateCourse(id, infoCourse) {
    return dispatch => {
        dispatch({
            type: CourseConstants.UPDATE_COURSE_REQUEST,
        });

        CourseService.updateCourse(id, infoCourse)
            .then(res => {
                dispatch({
                    type: CourseConstants.UPDATE_COURSE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: CourseConstants.UPDATE_COURSE_FAILURE,
                    error: err.response.data
                });
            })
    }
}