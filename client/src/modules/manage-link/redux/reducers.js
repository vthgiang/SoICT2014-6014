import { RoleConstants } from "./constants";

const initState = {
    list: [],
    item: null,
    error: null
}

export function role(state = initState, action) {

    switch (action.type) {
        case RoleConstants.GET_ROLES_SUCCESS:
            return {
                ...state,
                list: action.payload
            };

        case RoleConstants.SHOW_ROLE_SUCCESS:
            return {
                ...state,
                item: action.payload
            };

        case RoleConstants.CREATE_ROLE_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ]
            };

        default:
            return state;
    }
}