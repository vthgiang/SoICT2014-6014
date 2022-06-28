import {
    TagConstant
} from './constants';

const initState = {
    isLoading: false,
    totalList: 0,
    listTag: [],
    error: '',
}

export function tag(state = initState, action) {
    switch (action.type) {
        case TagConstant.GET_TAG_REQUEST:
        case TagConstant.CREATE_TAG_REQUEST:
        case TagConstant.DELETE_TAG_REQUEST:
        case TagConstant.UPDATE_TAG_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case TagConstant.GET_TAG_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listTag: action.payload.listTag !== undefined ? action.payload.listTag : [],
                totalList: action.payload.totalList,
            };
        case TagConstant.CREATE_TAG_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listTag: action.payload !== undefined ? action.payload : [],
                // totalList: action.payload.totalList,
            };
        case TagConstant.DELETE_TAG_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listTag: action.payload !== undefined ? action.payload : [],
                // totalList: action.payload.totalList,
            };
        case TagConstant.UPDATE_TAG_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listTag: action.payload !== undefined ? action.payload : [],
            };
        case TagConstant.GET_TAG_FAILURE:
        case TagConstant.CREATE_TAG_FAILURE:
        case TagConstant.DELETE_TAG_FAILURE:
        case TagConstant.UPDATE_TAG_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state;
    }
}