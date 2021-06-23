import { SystemApiConstants } from "./constants";

const initState = {
    listPaginateApi: [],
}

export function systemApis (state = initState, action) {
    switch (action.type) {
        case SystemApiConstants.GET_SYSTEM_API_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case SystemApiConstants.GET_SYSTEM_API_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPaginateApi: action.payload.systemApis,
                totalSystemApis: action.payload.totalSystemApis,
                totalPages: action.payload.totalPages
            };
        case SystemApiConstants.GET_SYSTEM_API_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        case SystemApiConstants.CREATE_SYSTEM_API_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case SystemApiConstants.CREATE_SYSTEM_API_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPaginateApi: [action.payload, ...state.listPaginateApi]
            };
        case SystemApiConstants.CREATE_SYSTEM_API_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        case SystemApiConstants.UPDATE_AUTO_SYSTEM_API_REQUEST:
            return {
                ...state,
                isLoading: true,
            };

        case SystemApiConstants.UPDATE_AUTO_SYSTEM_API_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPaginateApi: action.payload
            };
        case SystemApiConstants.UPDATE_AUTO_SYSTEM_API_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        default:
            return state;
    }
}