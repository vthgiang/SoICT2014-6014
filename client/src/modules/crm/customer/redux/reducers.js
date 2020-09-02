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

export function customer(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case CustomerConstants.GET_CUSTOMERS_REQUEST:
        case CustomerConstants.PAGINATE_CUSTOMERS_REQUEST:
        case CustomerConstants.CREATE_CUSTOMER_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case CustomerConstants.GET_CUSTOMERS_FAILE:
        case CustomerConstants.PAGINATE_CUSTOMERS_FAILE:
        case CustomerConstants.CREATE_CUSTOMER_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case CustomerConstants.GET_CUSTOMERS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case CustomerConstants.CREATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                list: [action.payload, ...state.customers.list],
                isLoading: false
            };
        
        case CustomerConstants.PAGINATE_CUSTOMERS_SUCCESS:
            return {
                ...state,
                listPaginate: action.payload.docs,
                isLoading: false
            };

        default:
            return state;
    }
}