import { ServiceLoggingConstants } from "./constants";

const initState = {
    listServiceLogging: [],
}

export function serviceLogging (state = initState, action) {
    switch (action.type) {
        case ServiceLoggingConstants.GET_SERVICE_LOGGING_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ServiceLoggingConstants.GET_SERVICE_LOGGING_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listServiceLogging: action.payload.data,
                totalLoggingRecords: action.payload.totalLoggingRecords,
                totalPages: action.payload.totalPages,
            };
        case ServiceLoggingConstants.GET_SERVICE_LOGGING_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        default:
            return state;
    }
}