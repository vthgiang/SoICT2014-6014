import { ApiConstants } from "./constants";

const initState = {
    listPaginateApi: [],
}

export function apis (state = initState, action) {
    switch (action.type) {
        case ApiConstants.GET_API_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case ApiConstants.GET_API_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listPaginateApi: action.payload.apis,
                totalApis: action.payload.totalApis,
                totalPages: action.payload.totalPages
            };
        case ApiConstants.GET_API_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        default:
            return state;
    }
}