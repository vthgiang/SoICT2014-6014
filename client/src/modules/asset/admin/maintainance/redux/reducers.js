import { MaintainanceConstants } from './constants';

const initState = {
    isLoading: false,

    mintainanceList: null,

    error: '',
}

export function mintainanceManager(state = initState, action) {
    switch (action.type) {
        case MaintainanceConstants.GET_MAINTAINANCE_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case MaintainanceConstants.GET_MAINTAINANCE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                mintainanceList: action.payload.mintainanceList,
                mintainanceLength: action.payload.mintainanceLength,
            }

        case MaintainanceConstants.GET_MAINTAINANCE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };

        case MaintainanceConstants.CREATE_MAINTAINANCE_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case MaintainanceConstants.CREATE_MAINTAINANCE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                mintainanceList: action.payload.mintainanceList,
                mintainanceLength: action.payload.mintainanceLength,
            }

        case MaintainanceConstants.CREATE_MAINTAINANCE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        
        case MaintainanceConstants.UPDATE_MAINTAINANCE_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case MaintainanceConstants.UPDATE_MAINTAINANCE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                mintainanceList: state.mintainanceList.map(obj => (obj._id === action.payload._id) ? action.payload : obj),
            }

        case MaintainanceConstants.UPDATE_MAINTAINANCE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        default:
            return state
    }
}
