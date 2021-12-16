import { SystemPageConstants } from "./constants";

const initState = {
    pageUrl: '', 
    pageApis: []
}

export const systemPage = (state = initState, action) => {
    switch (action.type) {
        case SystemPageConstants.GET_SYSTEM_PAGE_APIS:
            return {
                ...state,
                pageUrl: action.payload.pageUrl,
                isLoading: true
            };

        case SystemPageConstants.GET_SYSTEM_PAGE_APIS_SUCCESS:
            return {
                ...state,
                pageApis: action.payload.pageApis,
                isLoading: false,
            };
        case SystemPageConstants.GET_SYSTEM_PAGE_APIS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        default:
            return state;
    }
}