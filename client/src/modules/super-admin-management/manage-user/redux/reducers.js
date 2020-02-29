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
    isLoading: true
}

export function user(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case UserConstants.GET_USERS_REQUEST:
        case UserConstants.GET_USERS_PAGINATE_REQUEST:
        case UserConstants.CREATE_USER_REQUEST:
        case UserConstants.EDIT_USER_REQUEST:
        case UserConstants.DELETE_USER_REQUEST:
        case UserConstants.SEARCH_USER_BY_NAME_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case UserConstants.GET_USERS_FAILE:
        case UserConstants.GET_USERS_PAGINATE_FAILE:
        case UserConstants.CREATE_USER_FAILE:
        case UserConstants.EDIT_USER_FAILE:
        case UserConstants.DELETE_USER_FAILE:
        case UserConstants.SEARCH_USER_BY_NAME_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case UserConstants.GET_USERS_SUCCESS:

            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case UserConstants.GET_USERS_PAGINATE_SUCCESS:
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

        case UserConstants.EDIT_USER_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);
            if(index !== -1){
                state.list[index].name = action.payload.name;
                state.list[index].active = action.payload.active;
            };
            if(indexPaginate !== -1){
                state.listPaginate[indexPaginate].name = action.payload.name;
                state.listPaginate[indexPaginate].active = action.payload.active;
            }
            return {
                ...state,
                isLoading: false
            };

        case UserConstants.CREATE_USER_SUCCESS:
            
            return {
                ...state,
                list: [
                    ...state.list,
                    action.payload
                ],
                listPaginate: [
                    ...state.listPaginate,
                    action.payload
                ],
                isLoading: false
            };

        case UserConstants.DELETE_USER_SUCCESS:
            index = findIndex(state.list, action.payload);
            indexPaginate = findIndex(state.listPaginate, action.payload);
            if(index !== -1) state.list.splice(index, 1);
            if(indexPaginate !== -1) state.listPaginate.splice(indexPaginate, 1);
            return {
                ...state,
                isLoading: false
            };

        case UserConstants.SEARCH_USER_BY_NAME_SUCCESS:

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

        case 'LOGOUT':

            return initState;

        default:

            return state;
    }
}