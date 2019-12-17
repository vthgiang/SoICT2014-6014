import { LinkConstants } from "./constants";

const initState = {
    list: [],
    item: null,
    withRole: [],
    error: null
}

export function link (state = initState, action) {

    switch (action.type) {
        case LinkConstants.GET_LINKS_SUCCESS:
            return {
                ...state,
                list: action.payload
            };

        case LinkConstants.SHOW_LINK_SUCCESS:
            return {
                ...state,
                item: action.payload
            };

        case LinkConstants.CREATE_LINK_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ]
            };

        case LinkConstants.GET_LINKS_OF_ROLE_SUCCESS:
            return {
                ...state,
                withRole: action.payload
            };

        case 'RESET_APP':
            return initState;

        default:
            return state;
    }
}