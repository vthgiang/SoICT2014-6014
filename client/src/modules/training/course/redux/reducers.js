import {
    CourseConstants
} from './constants';
const initState = {
    isLoading: false,
    listCourses: [],
    courseByEducations: [],
    totalList: "",
    error: "",
}
export function course(state = initState, action) {
    switch (action.type) {
        case CourseConstants.GET_LISTCOURSE_REQUEST:
        case CourseConstants.GET_COURSE_BY_EDUCATION_REQUEST:
        case CourseConstants.CREATE_COURSE_REQUEST:
        case CourseConstants.DELETE_COURSE_REQUEST:
        case CourseConstants.UPDATE_COURSE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case CourseConstants.GET_LISTCOURSE_SUCCESS:
            return {
                ...state,
                listCourses: action.payload.listCourses,
                    totalList: action.payload.totalList,
                    isLoading: false,
            };
        case CourseConstants.GET_COURSE_BY_EDUCATION_SUCCESS:
            return {
                ...state,
                courseByEducations: action.payload,
                    isLoading: false,
            };
        case CourseConstants.CREATE_COURSE_SUCCESS:
            return {
                ...state,
                listCourse: [
                        ...state.listCourse,
                        action.payload
                    ],
                    isLoading: false,
            };
        case CourseConstants.DELETE_COURSE_SUCCESS:
            return {
                ...state,
                listCourse: state.listCourse.filter(course => course._id !== action.payload._id),
                    isLoading: false,
            };
        case CourseConstants.UPDATE_COURSE_SUCCESS:
            return {
                ...state,
                listCourse: state.listCourse.map(course =>
                        course._id === action.payload._id ?
                        action.payload : course
                    ),
                    isLoading: false,
            };
        case CourseConstants.GET_LISTCOURSE_FAILURE:
        case CourseConstants.GET_COURSE_BY_EDUCATION_FAILURE:
        case CourseConstants.CREATE_COURSE_FAILURE:
        case CourseConstants.DELETE_COURSE_FAILURE:
        case CourseConstants.UPDATE_COURSE_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error.message
            };
        default:
            return state
    }
}