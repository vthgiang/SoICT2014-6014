import { ApiRegistrationConstants } from "./constants";

const initState = {
    listPaginateApiRegistration: [],
}

export function apiRegistration (state = initState, action) {
    switch (action.type) {
        case ApiRegistrationConstants.GET_API_REGISTRATION_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ApiRegistrationConstants.GET_API_REGISTRATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPaginateApiRegistration: action.payload.apiRegistrations,
                totalApiRegistrations: action.payload.totalApiRegistrations,
                totalPages: action.payload.totalPages
            };
        case ApiRegistrationConstants.GET_API_REGISTRATION_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        case ApiRegistrationConstants.REGISTER_TO_USE_API_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ApiRegistrationConstants.REGISTER_TO_USE_API_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPaginateApiRegistration: [
                    action.payload,
                    ...state.listPaginateApiRegistration
                ]
            };
        case ApiRegistrationConstants.REGISTER_TO_USE_API_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
            
        default:
            return state;
    }
}