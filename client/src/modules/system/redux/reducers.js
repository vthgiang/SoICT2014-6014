import { SystemConsts } from "./constants";

const initState = {
    log: false,
    isLoading: false
}

export function system(state = initState, action) {

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
                log: action.payload,
                isLoading: false
            };

        case SystemConsts.TOGGLE_LOG_STATE_REQUEST_SUCCESS:
            return {
                ...state,
                log: action.payload ? !state.log : state.log,
                isLoading: false
            };

        default:
            return state;
    }
}