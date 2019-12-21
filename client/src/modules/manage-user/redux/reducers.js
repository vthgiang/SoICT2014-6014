import { UserConstants } from "./constants";

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

export function user(state = initState, action) {
    var index = -1;
    switch (action.type) {
        case UserConstants.GET_USERS_SUCCESS:

            return {
                ...state,
                list: action.payload
            };

        case UserConstants.EDIT_USER_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            if(index !== -1){
                state.list[index].name = action.payload.name;
                state.list[index].active = action.payload.active;
            };
            return state;

        case UserConstants.CREATE_USER_SUCCESS:
            
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ]
            };

        case UserConstants.DELETE_USER_SUCCESS:
            index = findIndex(state.list, action.payload);
            state.list.splice(index, 1);

            return {
                ...state,
            };

        case 'RESET_APP':

            return initState;

        default:

            return state;
    }
}