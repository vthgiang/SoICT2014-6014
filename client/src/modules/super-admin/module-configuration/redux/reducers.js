import {
    ConfigurationConstants
} from './constants';

const initState = {
    isLoading: false,
    humanResourceConfig: '',
    biddingConfig: '',
    error: "",
}

export function modelConfiguration(state = initState, action) {
    switch (action.type) {
        case ConfigurationConstants.GET_CONFIGURATION_REQUEST:
        case ConfigurationConstants.EDIT_CONFIGURATION_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case ConfigurationConstants.GET_CONFIGURATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                humanResourceConfig: action.payload.humanResourceConfig,
                biddingConfig: action.payload.biddingConfig,
            };

        case ConfigurationConstants.EDIT_CONFIGURATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                humanResourceConfig: action.payload.humanResourceConfig,
                biddingConfig: action.payload.biddingConfig,
            };

        case ConfigurationConstants.GET_CONFIGURATION_FAILE:
        case ConfigurationConstants.EDIT_CONFIGURATION_FAILE:
            return {
                ...state,
                isLoading: false,
            };

        default:
            return state
    }
}