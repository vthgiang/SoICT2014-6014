import { LogConstants } from "./constants";

const initState = {
    status: false,
    isLoading: false
}

export function log(state = initState, action) {

    switch (action.type) {
        case LogConstants.BACKUP_DATABASE_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case LogConstants.BACKUP_DATABASE_SUCCESS:
            return {
                ...state,
                isLoading: false
            };

        case LogConstants.RESTORE_DATABASE_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case LogConstants.RESTORE_DATABASE_SUCCESS:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}