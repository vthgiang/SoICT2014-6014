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
    error: null
}

export function role(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case RoleConstants.GET_ROLES_SUCCESS:
            return {
                ...state,
                list: action.payload
            };

        case RoleConstants.SHOW_ROLE_SUCCESS:
            return {
                ...state,
                item: action.payload
            };

        case RoleConstants.CREATE_ROLE_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ]
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
                ...state
            };

        case 'RESET_APP':
            return initState;

        default:
            return state;
    }
}