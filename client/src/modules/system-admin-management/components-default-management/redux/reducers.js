import { ComponentDefaultConstants } from "./constants";

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
    listPaginate: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    error: null,
    isLoading: true,
    item: null
}

export function componentsDefault (state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {

        case ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_REQUEST:
        case ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_PAGINATE_REQUEST:
        case ComponentDefaultConstants.SHOW_COMPONENT_DEFAULT_REQUEST:
        case ComponentDefaultConstants.CREATE_COMPONENT_DEFAULT_REQUEST:
        case ComponentDefaultConstants.EDIT_COMPONENT_DEFAULT_REQUEST:
        case ComponentDefaultConstants.DELETE_COMPONENT_DEFAULT_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case ComponentDefaultConstants.GET_COMPONENTS_DEFAULT_PAGINATE_SUCCESS:
            return {
                ...state,
                listPaginate: action.payload.docs,
                totalDocs: action.payload.totalDocs,
                limit: action.payload.limit,
                totalPages: action.payload.totalPages,
                page: action.payload.page,
                pagingCounter: action.payload.pagingCounter,
                hasPrevPage: action.payload.hasPrevPage,
                hasNextPage: action.payload.hasNextPage,
                prevPage: action.payload.prevPage,
                nextPage: action.payload.nextPage,
                isLoading: false
            };

        case ComponentDefaultConstants.SHOW_COMPONENT_DEFAULT_SUCCESS:
            return {
                ...state,
                item: action.payload,
                isLoading: false
            };

        case ComponentDefaultConstants.CREATE_COMPONENT_DEFAULT_SUCCESS:
            return {
                ...state,
                list: [
                    action.payload,
                    ...state.list
                ],
                listPaginate: [
                    action.payload,
                    ...state.listPaginate
                ],
                isLoading: false
            };

        case ComponentDefaultConstants.EDIT_COMPONENT_DEFAULT_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);
            if(index !== -1){
                state.list[index] = action.payload;
            }
            if(indexPaginate !== -1){
                state.listPaginate[indexPaginate] = action.payload;
            }
            return {
                ...state,
                isLoading: false
            };

        case ComponentDefaultConstants.DELETE_COMPONENT_DEFAULT_SUCCESS:
            index = findIndex(state.list, action.payload);
            indexPaginate = findIndex(state.listPaginate, action.payload);
            if(index !== -1) state.list.splice(index,1);
            if(indexPaginate !== -1) state.listPaginate.splice(indexPaginate, 1);
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}