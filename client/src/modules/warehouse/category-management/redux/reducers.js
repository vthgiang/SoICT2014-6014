import { CategoryConstants } from "./constants";

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initState = {
    isLoading: false,
    listCategories: [],
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
    
}

export function categories(state = initState, action){

    var index = -1;
    var indexPaginate = -1;

    switch(action.type) {
        case CategoryConstants.GETALL_CATEGORY_REQUEST:
        case CategoryConstants.PAGINATE_CATEGORY_REQUEST:
        case CategoryConstants.CREATE_CATEGORY_REQUEST:
        case CategoryConstants.UPDATE_CATEGORY_REQUEST:
        case CategoryConstants.DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case CategoryConstants.GETALL_CATEGORY_SUCCESS:
            return {
                ...state,
                listCategories: action.payload,
                isLoading: false
            };

        case CategoryConstants.PAGINATE_CATEGORY_SUCCESS:
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
        
        case CategoryConstants.CREATE_CATEGORY_SUCCESS:
            return {
                ...state,
                listCategories: [
                    ...state.listCategories,
                    action.payload
                ],
                listPaginate: [
                    ...state.listPaginate,
                    action.payload
                ],
                isLoading: false
            };

        case CategoryConstants.UPDATE_CATEGORY_SUCCESS:
            index = findIndex(state.listCategories, action.payload._id);
            indexPaginate = findIndex(state.listPaginate, action.payload._id)

            if(index !== -1){
                state.listCategories[index] = action.payload;
            }

            if(indexPaginate !== -1){
                state.listPaginate[indexPaginate] = action.payload;
            }
            return {
                ...state,
                isLoading: false
            }

        case CategoryConstants.DELETE_CATEGORY_SUCCESS:
            index = findIndex(state.listCategories, action.payload);
            indexPaginate = findIndex(state.listPaginate, action.payload);
            if(index !== -1) {
                state.listCategories.splice(index, 1);
            }
            if(indexPaginate !== -1){
                state.listPaginate.splice(indexPaginate, 1);
            }
            return {
                ...state,
                isLoading: false
            }

        case CategoryConstants.GETALL_CATEGORY_FAILURE:
        case CategoryConstants.CREATE_CATEGORY_FAILURE:
        case CategoryConstants.PAGINATE_CATEGORY_FAILURE:
        case CategoryConstants.UPDATE_CATEGORY_FAILURE:
        case CategoryConstants.DELETE_CATEGORY_FAILURE:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
}