import { DepartmentConstants } from "./constants";

const initState = {
    list: [],
    tree: null,
    item: null,
    error: null,
    isLoading: false
}

export function department(state = initState, action) {

    switch (action.type) {
        case DepartmentConstants.GET_DEPARTMENTS_REQUEST:
        case DepartmentConstants.CREATE_DEPARTMENT_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case DepartmentConstants.GET_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                list: action.payload.list,
                tree: action.payload.tree,
                isLoading: false
            };

        case DepartmentConstants.CREATE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload.department
                ],
                tree: action.payload.tree,
                isLoading: false
            };

        case 'RESET_APP':
            return initState;

        default:
            return state;
    }
}