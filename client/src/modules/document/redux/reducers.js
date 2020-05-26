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

        domains: {
            list: [],
            tree: []
        },

        data: {
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

            user_manage: []
        },
    },
    user: {

    }
}

export function documents(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case DocumentConstants.GET_DOCUMENTS_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_REQUEST:  
        case DocumentConstants.GET_DOCUMENT_CATEGORIES_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_CATEGORY_REQUEST:        
        case DocumentConstants.GET_DOCUMENT_DOMAINS_REQUEST:
        case DocumentConstants.CREATE_DOCUMENT_DOMAIN_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case DocumentConstants.GET_DOCUMENTS_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_FAILE:  
        case DocumentConstants.GET_DOCUMENT_CATEGORIES_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_CATEGORY_FAILE:        
        case DocumentConstants.GET_DOCUMENT_DOMAINS_FAILE:
        case DocumentConstants.CREATE_DOCUMENT_DOMAIN_FAILE:
            return {
                ...state,
                isLoading: false,
            }

        case DocumentConstants.GET_DOCUMENTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    data: {
                        ...state.administration.data,
                        list: action.payload.list,
                        paginate: action.payload.list
                    }
                }
            };

        case DocumentConstants.CREATE_DOCUMENT_SUCCESS:
            
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    data: {
                        ...state.administration.data,
                        list: [
                            action.payload,
                            ...state.administration.data.list
                        ],
                        paginate: [
                            ...state.administration.data.paginate,
                            action.payload
                        ]
                    }
                }
            };

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

        case DocumentConstants.GET_DOCUMENT_DOMAINS_SUCCESS:
        case DocumentConstants.CREATE_DOCUMENT_DOMAIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                administration: {
                    ...state.administration,
                    domains: action.payload
                }
            };

        default:
            return state;
    }
}