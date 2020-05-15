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
    isLoading: false,
    administration: {
        types: {
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
        documents: {

        },
    },
    user: {

    }
}

export function documents(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case DocumentConstants.GET_DOCUMENT_TYPES_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_TYPE_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case DocumentConstants.GET_DOCUMENT_TYPES_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_TYPE_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case DocumentConstants.GET_DOCUMENT_TYPES_SUCCESS:

            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    types: {
                        ...state.administration.types,
                        list: action.payload
                    }
                }
            };

        case DocumentConstants.CREATE_DOCUMENT_TYPE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    types: {
                        ...state.administration.types,
                        list: [
                            action.payload,
                            ...state.administration.types.list
                        ]
                    }
                }
            };

        default:
            return state;
    }
}