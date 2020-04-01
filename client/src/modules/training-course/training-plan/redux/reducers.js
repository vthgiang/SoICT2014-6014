import {
    CourseConstants
} from './constants';
const initState = {
    listCourse: []
}
export function course(state = initState, action) {
    switch (action.type) {
        case CourseConstants.GET_LISTCOURSE_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case CourseConstants.GET_LISTCOURSE_SUCCESS:
            return {
                ...state,
                listCourse: action.listCourse.content.allList,
                totalList : action.listCourse.content.totalList,
                    isLoading: false,
            };
        case CourseConstants.GET_LISTCOURSE_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };

        case CourseConstants.GET_COURSE_BY_EDUCATION_REQUEST:
            return {
                ...state,
                isLoading: true,

            };
        case CourseConstants.GET_COURSE_BY_EDUCATION_SUCCESS:
            return {
                ...state,
                CourseByEducation: action.CourseByEducation.content,
                    isLoading: false,
            };
        case CourseConstants.GET_COURSE_BY_EDUCATION_FAILURE:
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
                listCourse: state.listCourse.filter(course => course._id !== action.deleteCourse.content._id),
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
                        course._id === action.updateCourse.content._id ?
                        action.updateCourse.content : course
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