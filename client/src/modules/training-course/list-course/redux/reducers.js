import {
    CourseConstants
} from './constants';

export function Course(state = {}, action) {
    switch (action.type) {
        case CourseConstants.GET_LISTCOURSE_REQUEST:
            return {
                ...state,
                isLoading: true,

            };
        case CourseConstants.GET_LISTCOURSE_SUCCESS:
            return {
                ...state,
                listCourse: action.listCourse.content,
                    isLoading: false,
            };
        case CourseConstants.GET_LISTCOURSE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case CourseConstants.CREATE_COURSE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case CourseConstants.CREATE_COURSE_SUCCESS:
            return {
                ...state,
                listCourse: [
                        ...state.listCourse,
                        action.newCourse.content
                    ],
                    isLoading: false,
            };
        case CourseConstants.CREATE_COURSE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case CourseConstants.DELETE_COURSE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case CourseConstants.DELETE_COURSE_SUCCESS:
            return {
                ...state,
                listCourse: state.listCourse.filter(course => course.numberEducation !== action.numberEducation.content.numberEducation),
                    isLoading: false,
            };
        case CourseConstants.DELETE_COURSE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };
        case CourseConstants.UPDATE_COURSE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case CourseConstants.UPDATE_COURSE_SUCCESS:
            return {
                ...state,
                listCourse: state.listCourse.map(course =>
                        course.numberEducation === action.infoCourse.content.numberEducation ?
                        action.infoCourse.content : course
                    ),
                    isLoading: false,
            };
        case CourseConstants.UPDATE_COURSE_FAILURE:
            return {
                error: action.error,
                    isLoading: false,
            };

        default:
            return state
    }
}