import {
    EducationConstants
} from './constants';

export function education(state = {}, action) {
    switch (action.type) {
        case EducationConstants.GET_LIST_ALL_EDUCATION_REQUEST:
            return {
                ...state,
                isLoading: true,

            };
        case EducationConstants.GET_LIST_ALL_EDUCATION_SUCCESS:
            return {
                ...state,
                listAll: action.listAll.content,
                    isLoading: false,
            };
        case EducationConstants.GET_LIST_ALL_EDUCATION_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case EducationConstants.GET_LISTEDUCATION_REQUEST:
            return {
                ...state,
                isLoading: true,

            };
        case EducationConstants.GET_LISTEDUCATION_SUCCESS:
            return {
                ...state,
                listEducation: action.listEducation.content.allList,
                    totalList: action.listEducation.content.totalList,
                    isLoading: false,
            };
        case EducationConstants.GET_LISTEDUCATION_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case EducationConstants.CREATE_EDUCATION_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case EducationConstants.CREATE_EDUCATION_SUCCESS:
            return {
                ...state,
                listEducation: [
                        ...state.listEducation,
                        action.newEducation.content
                    ],
                    isLoading: false,
            };
        case EducationConstants.CREATE_EDUCATION_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case EducationConstants.DELETE_EDUCATION_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case EducationConstants.DELETE_EDUCATION_SUCCESS:
            return {
                ...state,
                listEducation: state.listEducation.filter(education => education._id !== action.deleteEducation.content._id),
                    isLoading: false,
            };
        case EducationConstants.DELETE_EDUCATION_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case EducationConstants.UPDATE_EDUCATION_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case EducationConstants.UPDATE_EDUCATION_SUCCESS:
            return {
                ...state,
                listEducation: state.listEducation.map(education =>
                        education._id === action.updateEducation.content._id ?
                        action.updateEducation.content : education
                    ),
                    isLoading: false,
            };
        case EducationConstants.UPDATE_EDUCATION_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        default:
            return state
    }
}