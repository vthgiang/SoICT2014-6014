import {
    CareerConstant
} from './constants';

const initState = {
    isLoading: false,

    totalListField: 0,
    listField: [],

    totalListPost: 0,
    listPosition: [],

    totalListAction: 0,
    listAction: [],

    error: '',
}

export function career(state = initState, action) {
    switch (action.type) {
        case CareerConstant.GET_CAREER_POSITION_REQUEST:
        case CareerConstant.CREATE_CAREER_POSITION_REQUEST:
        case CareerConstant.DELETE_CAREER_POSITION_REQUEST:
        case CareerConstant.UPDATE_CAREER_POSITION_REQUEST:

        case CareerConstant.GET_CAREER_FIELD_REQUEST:
        case CareerConstant.CREATE_CAREER_FIELD_REQUEST:
        case CareerConstant.DELETE_CAREER_FIELD_REQUEST:
        case CareerConstant.UPDATE_CAREER_FIELD_REQUEST:

        case CareerConstant.GET_CAREER_ACTION_REQUEST:
        case CareerConstant.CREATE_CAREER_ACTION_REQUEST:
        case CareerConstant.DELETE_CAREER_ACTION_REQUEST:
        case CareerConstant.UPDATE_CAREER_ACTION_REQUEST:
            return {
                ...state,
                isLoading: true,
            };


        case CareerConstant.GET_CAREER_POSITION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPosition: action.payload.listPosition !== undefined ? action.payload.listPosition : [],
                totalListPost: action.payload.totalList,
            };
        case CareerConstant.GET_CAREER_FIELD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listField: action.payload.listField !== undefined ? action.payload.listField : [],
                totalListField: action.payload.totalList,
            };
        case CareerConstant.GET_CAREER_ACTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAction: action.payload.listAction !== undefined ? action.payload.listAction : [],
                totalListAction: action.payload.totalList,
            };


        case CareerConstant.CREATE_CAREER_FIELD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listField: action.payload,
            };
        case CareerConstant.CREATE_CAREER_POSITION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPosition: action.payload,
            };
        case CareerConstant.CREATE_CAREER_ACTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAction: action.payload,
            };


        case CareerConstant.UPDATE_CAREER_POSITION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPosition: action.payload,
            };
        case CareerConstant.UPDATE_CAREER_FIELD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listField: action.payload,
            };
        case CareerConstant.UPDATE_CAREER_ACTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAction: action.payload,
            };


        case CareerConstant.DELETE_CAREER_FIELD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listField: action.payload,
            };
        case CareerConstant.DELETE_CAREER_ACTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAction: action.payload,
            };
        case CareerConstant.DELETE_CAREER_POSITION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPosition: action.payload,
            };


        case CareerConstant.GET_CAREER_POSITION_FAILURE:
        case CareerConstant.CREATE_CAREER_POSITION_FAILURE:
        case CareerConstant.DELETE_CAREER_POSITION_FAILURE:
        case CareerConstant.UPDATE_CAREER_POSITION_FAILURE:

        case CareerConstant.GET_CAREER_FIELD_FAILURE:
        case CareerConstant.CREATE_CAREER_FIELD_FAILURE:
        case CareerConstant.DELETE_CAREER_FIELD_FAILURE:
        case CareerConstant.UPDATE_CAREER_FIELD_FAILURE:

        case CareerConstant.GET_CAREER_ACTION_FAILURE:
        case CareerConstant.CREATE_CAREER_ACTION_FAILURE:
        case CareerConstant.DELETE_CAREER_ACTION_FAILURE:
        case CareerConstant.UPDATE_CAREER_ACTION_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state;
    }
}