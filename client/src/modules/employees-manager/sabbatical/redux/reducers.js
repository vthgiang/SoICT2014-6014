import {
    SabbaticalConstants
} from './constants';

export function Sabbatical(state = {listSabbatical:[]}, action) {
    switch (action.type) {
        case SabbaticalConstants.GET_SABBATICAL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SabbaticalConstants.GET_SABBATICAL_SUCCESS:
            return {
                ...state,
                listSabbatical: action.listSabbatical.content.listSabbatical,
                totalList: action.listSabbatical.content.totalList,
                    isLoading: false,
            };
        case SabbaticalConstants.GET_SABBATICAL_FAILURE:
            return {
                error: action.error
            };
        case SabbaticalConstants.CREATE_SABBATICAL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SabbaticalConstants.CREATE_SABBATICAL_SUCCESS:
            return {
                ...state,
                listSabbatical: [
                        ...state.listSabbatical,
                        action.newSabbatical.content
                    ],
                    isLoading: false,
            };
        case SabbaticalConstants.CREATE_SABBATICAL_FAILURE:
            return {
                error: action.error
            };
        case SabbaticalConstants.DELETE_SABBATICAL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SabbaticalConstants.DELETE_SABBATICAL_SUCCESS:
            return {
                ...state,
                listSabbatical: state.listSabbatical.filter(Sabbatical => (Sabbatical._id !== action.sabbaticalDelete.content._id)),
                    isLoading: false,
            };
        case SabbaticalConstants.DELETE_SABBATICAL_FAILURE:
            return {
                error: action.error
            };
        case SabbaticalConstants.UPDATE_SABBATICAL_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case SabbaticalConstants.UPDATE_SABBATICAL_SUCCESS:
            return {
                ...state,
                listSabbatical: state.listSabbatical.map(Sabbatical =>
                        Sabbatical._id === action.infoSabbatical.content._id ?
                        action.infoSabbatical.content : Sabbatical
                    ),
                    isLoading: false,
            };
        case SabbaticalConstants.UPDATE_SABBATICAL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}