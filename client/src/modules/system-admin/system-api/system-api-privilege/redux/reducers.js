import { PrivilegeApiContants } from "./constants";

const initState = {
    listPaginatePrivilegeApi: [],
}

export function privilegeApis (state = initState, action) {
    switch (action.type) {
        case PrivilegeApiContants.GET_PRIVILEGE_API_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case PrivilegeApiContants.GET_PRIVILEGE_API_SUCCESS:
            console.log(action.payload)
            return {
                ...state,
                isLoading: false,
                listPaginatePrivilegeApi: action.payload.privilegeApis,
                totalPrivilegeApis: action.payload.totalPrivilegeApis,
                totalPages: action.payload.totalPages
            };
        case PrivilegeApiContants.GET_PRIVILEGE_API_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        case PrivilegeApiContants.CREATE_PRIVILEGE_API_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case PrivilegeApiContants.CREATE_PRIVILEGE_API_SUCCESS:
            console.log(action.payload)
            return {
                ...state,
                isLoading: false,
                listPaginatePrivilegeApi: [action.payload, ...state.listPaginatePrivilegeApi],
                totalPriviegeApis: state.totalPriviegeApis++,
            };
        case PrivilegeApiContants.CREATE_PRIVILEGE_API_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        default:
            return state;
    }
}