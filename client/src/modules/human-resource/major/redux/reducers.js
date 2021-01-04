import {
    MajorConstant
} from './constants';

const initState = {
    isLoading: false,
    totalList: 0,
    listMajor: [],
    error: '',
}

export function major(state = initState, action) {
    switch (action.type) {
        case MajorConstant.GET_MAJOR_REQUEST:
        case MajorConstant.CREATE_MAJOR_REQUEST:
        case MajorConstant.DELETE_MAJOR_REQUEST:
        case MajorConstant.UPDATE_MAJOR_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case MajorConstant.GET_MAJOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listMajor: action.payload.listMajor !== undefined ? action.payload.listMajor : [],
                totalList: action.payload.totalList,
            };
        case MajorConstant.CREATE_MAJOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listMajor: action.payload,
            };
        case MajorConstant.DELETE_MAJOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listMajor: action.payload,
            };
        case MajorConstant.UPDATE_MAJOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listMajor: action.payload,
            };
        case MajorConstant.GET_MAJOR_FAILURE:
        case MajorConstant.CREATE_MAJOR_FAILURE:
        case MajorConstant.DELETE_MAJOR_FAILURE:
        case MajorConstant.UPDATE_MAJOR_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state;
    }
}