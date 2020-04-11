import {
    SabbaticalConstants
} from './constants';

export function sabbatical(state = {
    listSabbatical: []
}, action) {
    switch (action.type) {
        case SabbaticalConstants.GET_SABBATICAL_REQUEST:
        case SabbaticalConstants.CREATE_SABBATICAL_REQUEST:
        case SabbaticalConstants.DELETE_SABBATICAL_REQUEST:
        case SabbaticalConstants.UPDATE_SABBATICAL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SabbaticalConstants.GET_SABBATICAL_SUCCESS:
            return {
                ...state,
                listSabbatical: action.payload.listSabbatical,
                    totalList: action.payload.totalList,
                    isLoading: false,
            };
        case SabbaticalConstants.CREATE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listSabbatical: [
                        ...state.listSabbatical,
                        action.payload
                    ],
            };
        case SabbaticalConstants.DELETE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listSabbatical: state.listSabbatical.filter(Sabbatical => (Sabbatical._id !== action.payload._id)),
            };
        case SabbaticalConstants.UPDATE_SABBATICAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                    listSabbatical: state.listSabbatical.map(Sabbatical =>
                        Sabbatical._id === action.payload._id ?
                        action.payload : Sabbatical
                    ),
            };
        case SabbaticalConstants.GET_SABBATICAL_FAILURE:
        case SabbaticalConstants.CREATE_SABBATICAL_FAILURE:
        case SabbaticalConstants.DELETE_SABBATICAL_FAILURE:
        case SabbaticalConstants.UPDATE_SABBATICAL_FAILURE:
            return {
                ...state,
                isLoading: false,
                    error: action.error.message
            };
        default:
            return state
    }
}