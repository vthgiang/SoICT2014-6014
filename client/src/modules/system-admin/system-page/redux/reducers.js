import { SystemPageConstants } from "./constants";

const initState = {
    pageUrl: '', 
    pageApis: []
}

const initialState = {
    lists: [],
    isLoading: false,
    error: null,
    totalList: 0,
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

export const systemAdminPage = (state = initialState, action) => {
    let index = -1;
    console.log("actionType", action.type);
    switch (action.type) {
        case SystemPageConstants.GET_SYSTEM_ADMIN_PAGE_REQUEST:
        case SystemPageConstants.DEL_SYSTEM_ADMIN_PAGE_REQUEST:
        case SystemPageConstants.ADD_SYSTEM_ADMIN_PAGE_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case SystemPageConstants.GET_SYSTEM_ADMIN_PAGE_FAILURE:
        case SystemPageConstants.DEL_SYSTEM_ADMIN_PAGE_REQUEST:
        case SystemPageConstants.ADD_SYSTEM_ADMIN_PAGE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case SystemPageConstants.GET_SYSTEM_ADMIN_PAGE_SUCCESS:
            return {
                ...state,
                lists: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case SystemPageConstants.DEL_SYSTEM_ADMIN_PAGE_REQUEST:
            return {
                ...state,
                lists: state.lists.filter(example => !action.exampleIds.includes(example?._id)),
                isLoading: false
            }
        case SystemPageConstants.ADD_SYSTEM_ADMIN_PAGE_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
        default:
            return state
    }
}