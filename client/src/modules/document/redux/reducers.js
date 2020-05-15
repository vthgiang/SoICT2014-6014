import { DocumentConstants } from "./constants";

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
    value: {},
    isLoading: false,
    administration: {
        categories: {
            list: [], paginate: [],
            totalDocs: 0,
            limit: 0,
            totalPages: 0,
            page: 0,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,
        },
        listData: {
            list: [], paginate: [],
            totalDocs: 0,
            limit: 0,
            totalPages: 0,
            page: 0,
            pagingCounter: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,
        },
    },
    user: {

    }
}

export function documents(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case DocumentConstants.GET_DOCUMENT_CATEGORIES_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_CATEGORY_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case DocumentConstants.GET_DOCUMENT_CATEGORIES_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_CATEGORY_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case DocumentConstants.GET_DOCUMENT_CATEGORIES_SUCCESS:

            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    categories: {
                        ...state.administration.categories,
                        list: action.payload
                    }
                }
            };

        case DocumentConstants.CREATE_DOCUMENT_CATEGORY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    categories: {
                        ...state.administration.categories,
                        list: [
                            action.payload,
                            ...state.administration.categories.list
                        ]
                    }
                }
            };

        default:
            return state;
    }
}