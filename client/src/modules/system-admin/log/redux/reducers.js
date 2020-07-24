import { LogConstants } from "./constants";

const initState = {
    status: false,
    isLoading: false
}

export function log(state = initState, action) {

    switch (action.type) {
        case LogConstants.GET_LOG_STATE_REQUEST:
        case LogConstants.TOGGLE_LOG_STATE_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case LogConstants.GET_LOG_STATE_SUCCESS:
            return {
                ...state,
                status: action.payload,
                isLoading: false
            };

        case LogConstants.TOGGLE_LOG_STATE_SUCCESS:
            return {
                ...state,
                status: action.payload ? !state.status : state.status,
                isLoading: false
            };

        default:
            return state;
    }
}