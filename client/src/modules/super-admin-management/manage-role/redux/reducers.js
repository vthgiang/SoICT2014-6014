import { RoleConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if(value._id === id){
            result = index;
        }
    });
    return result;
}

const initState = {
    list: [],
    item: null,
    error: null,
    isLoading: true
}

export function role(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case RoleConstants.GET_ROLES_REQUEST:
        case RoleConstants.CREATE_ROLE_REQUEST:
        case RoleConstants.EDIT_ROLE_REQUEST:
        case RoleConstants.DELETE_ROLE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case RoleConstants.GET_ROLES_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case RoleConstants.SHOW_ROLE_SUCCESS:
            return {
                ...state,
                item: action.payload,
                isLoading: false
            };

        case RoleConstants.CREATE_ROLE_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ],
                isLoading: false
            };
        
        case RoleConstants.EDIT_ROLE_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            console.log("role data: ",action.payload);
            if(index !== -1){
                state.list[index].name = action.payload.name;
                state.list[index].abstract = action.payload.abstract;
                state.list[index].users = action.payload.users;
            }
            return {
                ...state,
                isLoading: false
            };

        case RoleConstants.DELETE_ROLE_SUCCESS:
            index = findIndex(state.list, action.payload);
            state.list.splice(index, 1);

            return {
                ...state,
                isLoading: false
            };

        case 'RESET_APP':
            return initState;

        default:
            return state;
    }
}
