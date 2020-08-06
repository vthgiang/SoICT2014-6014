import { CustomerConstants } from "./constants";

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
    customers: {
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
        isLoading: true,
    },
    group: {
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
        isLoading: true,
    }
}

export function customer(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case CustomerConstants.GET_CUSTOMERS_REQUEST:
        case CustomerConstants.PAGINATE_CUSTOMERS_REQUEST:
        case CustomerConstants.CREATE_CUSTOMER_REQUEST:
            return {
                ...state,
                customers: {
                    ...state.customers,
                    isLoading: true
                }
            }

        case CustomerConstants.GET_CUSTOMERS_FAILE:
        case CustomerConstants.PAGINATE_CUSTOMERS_FAILE:
        case CustomerConstants.CREATE_CUSTOMER_FAILE:
            return {
                ...state,
                customers: {
                    ...state.customers,
                    isLoading: false
                }
            }

        case CustomerConstants.GET_CUSTOMERS_SUCCESS:
            return {
                ...state,
                customers: {
                    ...state.customers,
                    list: action.payload,
                    isLoading: false
                }
            };

        case CustomerConstants.CREATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: {
                    ...state.customers,
                    list: [action.payload, ...state.customers.list],
                    isLoading: false
                }
            };

        case CustomerConstants.GET_CUSTOMER_GROUPS_REQUEST:
        case CustomerConstants.PAGINATE_CUSTOMER_GROUPS_REQUEST:
            return {
                ...state,
                group: {
                    ...state.group,
                    isLoading: true
                }
            }

        case CustomerConstants.GET_CUSTOMER_GROUPS_FAILE:
        case CustomerConstants.PAGINATE_CUSTOMER_GROUPS_FAILE:
            return {
                ...state,
                group: {
                    ...state.group,
                    isLoading: false
                }
            }

        case CustomerConstants.GET_CUSTOMER_GROUPS_SUCCESS:
            return {
                ...state,
                group: {
                    ...state.group,
                    list: action.payload,
                    isLoading: false
                }
            };

        default:
            return state;
    }
}