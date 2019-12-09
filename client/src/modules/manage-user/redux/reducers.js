import { UserConstants } from "./constants";

const initState = {
    list: [],
    item: null,
    error: null
}

export function user(state = initState, action) {

    switch (action.type) {
        case UserConstants.GET_USERS_SUCCESS:
            return {
                ...state,
                list: action.payload
            };

        default:
            return state;
    }
}