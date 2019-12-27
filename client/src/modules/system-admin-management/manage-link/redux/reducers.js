import { LinkConstants } from "./constants";

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

export function link (state = initState, action) {
    var index = -1;
    switch (action.type) {

        case LinkConstants.GET_LINKS_REQUEST:
        case LinkConstants.SHOW_LINK_REQUEST:
        case LinkConstants.CREATE_LINK_REQUEST:
        case LinkConstants.EDIT_LINK_REQUEST:
        case LinkConstants.DELETE_LINK_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case LinkConstants.GET_LINKS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case LinkConstants.SHOW_LINK_SUCCESS:
            return {
                ...state,
                item: action.payload,
                isLoading: false
            };

        case LinkConstants.CREATE_LINK_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ],
                isLoading: false
            };

        case LinkConstants.EDIT_LINK_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            if(index !== -1){
                state.list[index].url = action.payload.url;
                state.list[index].description = action.payload.description;
                state.list[index].roles = action.payload.roles;
            }
            return {
                ...state,
                isLoading: false
            };

        case LinkConstants.DELETE_LINK_SUCCESS:
            index = findIndex(state.list, action.payload);
            if(index !== -1){
                state.list.splice(index,1);
            }
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