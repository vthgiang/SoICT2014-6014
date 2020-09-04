import { CrmCustomerConstants } from "./constants";

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
        case CrmCustomerConstants.GET_CRM_CUSTOMERS_REQUEST:
        case CrmCustomerConstants.PAGINATE_CRM_CUSTOMERS_REQUEST:
        case CrmCustomerConstants.CREATE_CRM_CUSTOMER_REQUEST:
        case CrmCustomerConstants.GET_CRM_CUSTOMER_REQUEST:
        case CrmCustomerConstants.EDIT_CRM_CUSTOMER_REQUEST:
        case CrmCustomerConstants.DELETE_CRM_CUSTOMER_REQUEST:

            return {
                ...state,
                isLoading: true
            }

        case CrmCustomerConstants.GET_CRM_CUSTOMERS_FAILE:
        case CrmCustomerConstants.PAGINATE_CRM_CUSTOMERS_FAILE:
        case CrmCustomerConstants.CREATE_CRM_CUSTOMER_FAILE:
        case CrmCustomerConstants.GET_CRM_CUSTOMER_FAILE:
        case CrmCustomerConstants.EDIT_CRM_CUSTOMER_FAILE:
        case CrmCustomerConstants.DELETE_CRM_CUSTOMER_FAILE:
            
            return {
                ...state,
                isLoading: false
            }

        case CrmCustomerConstants.GET_CRM_CUSTOMERS_SUCCESS:

            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case CrmCustomerConstants.CREATE_CRM_CUSTOMER_SUCCESS:

            return {
                ...state,
                list: [action.payload, ...state.customers.list],
                isLoading: false
            };
        
        case CrmCustomerConstants.PAGINATE_CRM_CUSTOMERS_SUCCESS:

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

        case CrmCustomerConstants.EDIT_CRM_CUSTOMER_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            if(index !== -1) state.list[index] = action.payload;
            indexPaginate = findIndex(state.listPaginate, action.payload._id);
            if(indexPaginate !== -1) state.listPaginate[index] = action.payload;

            return {
                ...state,
                isLoading: false
            };

        case CrmCustomerConstants.DELETE_CRM_CUSTOMER_SUCCESS:
            index = findIndex(state.list, action.payload._id);
            if(index !== -1) state.list.splice(index, 1);
            indexPaginate = findIndex(state.listPaginate, action.payload._id);
            if(indexPaginate !== -1) state.listPaginate.splice(indexPaginate, 1);

            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}