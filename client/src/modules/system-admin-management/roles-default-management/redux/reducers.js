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
    error: null,
    isLoading: true
}

export function role(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case RoleConstants.GET_ROLES_REQUEST:
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

        default:
            return state;
    }
}
