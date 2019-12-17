import { DepartmentConstants } from "./constants";

const initState = {
    list: [],
    item: null,
    error: null
}

export function department(state = initState, action) {

    switch (action.type) {
        case DepartmentConstants.GET_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                list: action.payload
            };

        case 'RESET_APP':
            return initState;

        default:
            return state;
    }
}