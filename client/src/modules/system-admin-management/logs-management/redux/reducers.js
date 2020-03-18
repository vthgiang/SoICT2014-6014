import { SystemConsts } from "./constants";

const initState = {
    status: false,
    isLoading: false
}

export function log(state = initState, action) {

    switch (action.type) {
        case SystemConsts.GET_LOG_STATE_REQUEST:
        case SystemConsts.TOGGLE_LOG_STATE_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case SystemConsts.GET_LOG_STATE_REQUEST_SUCCESS:
            return {
                ...state,
                status: action.payload,
                isLoading: false
            };

        case SystemConsts.TOGGLE_LOG_STATE_REQUEST_SUCCESS:
            return {
                ...state,
                status: action.payload ? !state.status : state.status,
                isLoading: false
            };

        default:
            return state;
    }
}