import { ComponentConstants } from "./constants";

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
    isLoading: false
}

export function component (state = initState, action) {
    var index = -1;
    switch (action.type) {

        case ComponentConstants.GET_COMPONENTS_REQUEST:
        case ComponentConstants.SHOW_COMPONENT_REQUEST:
        case ComponentConstants.CREATE_COMPONENT_REQUEST:
        case ComponentConstants.EDIT_COMPONENT_REQUEST:
        case ComponentConstants.DELETE_COMPONENT_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case ComponentConstants.GET_COMPONENTS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case ComponentConstants.SHOW_COMPONENT_SUCCESS:
            return {
                ...state,
                item: action.payload,
                isLoading: false
            };

        case ComponentConstants.CREATE_COMPONENT_SUCCESS:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ],
                isLoading: false
            };

        case ComponentConstants.EDIT_COMPONENT_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            if(index !== -1){
                state.list[index].name = action.payload.name;
                state.list[index].description = action.payload.description;
                state.list[index].roles = action.payload.roles;
            }
            return {
                ...state,
                isLoading: false
            };

        case ComponentConstants.DELETE_COMPONENT_SUCCESS:
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