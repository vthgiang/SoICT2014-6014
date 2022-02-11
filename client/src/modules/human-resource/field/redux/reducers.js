import {
    FieldsConstants
} from './constants';

const initState = {
    listFields: [],
    totalList: 0,
    isLoading: false,
    error: "",
}

export function field(state = initState, action) {
    switch (action.type) {
        case FieldsConstants.GET_FIELDS_REQUEST:
        case FieldsConstants.CREATE_FIELDS_REQUEST:
        case FieldsConstants.DELETE_FIELDS_REQUEST:
        case FieldsConstants.UPDATE_FIELDS_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case FieldsConstants.GET_FIELDS_SUCCESS:
            return {
                ...state,
                listFields: action.payload.listField,
                totalList: action.payload.totalList,
                isLoading: false,
            };
        case FieldsConstants.CREATE_FIELDS_SUCCESS:
            return {
                ...state,
                listFields: [
                    ...state.listFields,
                    action.payload
                ],
                isLoading: false,
            };
        case FieldsConstants.DELETE_FIELDS_SUCCESS:
            return {
                ...state,
                listFields: state.listFields.filter(field => (field._id !== action.payload._id)),
                    isLoading: false,
            };
        case FieldsConstants.UPDATE_FIELDS_SUCCESS:
            return {
                ...state,
                listFields: state.listFields.map(field =>
                    (field._id === action.payload._id) ?
                    action.payload : field
                ),
                isLoading: false,
            };
        case FieldsConstants.GET_FIELDS_FAILURE:
        case FieldsConstants.CREATE_FIELDS_FAILURE:
        case FieldsConstants.DELETE_FIELDS_FAILURE:
        case FieldsConstants.UPDATE_FIELDS_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error
            };
        default:
            return state
    }
}