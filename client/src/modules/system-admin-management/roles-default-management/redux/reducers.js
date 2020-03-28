import { RoleDefaultConstants } from "./constants";

const initState = {
    list: [],
    error: null,
    isLoading: true
}

export function rolesDefault(state = initState, action) {
    switch (action.type) {
        case RoleDefaultConstants.GET_ROLES_DEFAULT_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case RoleDefaultConstants.GET_ROLES_DEFAULT_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        default:
            return state;
    }
}
