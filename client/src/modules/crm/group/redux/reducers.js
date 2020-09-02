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

export function customerGroup(state = initState, action) {
    var index = -1;
    var indexPaginate = -1;
    switch (action.type) {
        case CustomerConstants.GET_CUSTOMER_GROUPS_REQUEST:
        case CustomerConstants.PAGINATE_CUSTOMER_GROUPS_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case CustomerConstants.GET_CUSTOMER_GROUPS_FAILE:
        case CustomerConstants.PAGINATE_CUSTOMER_GROUPS_FAILE:
            return {
                ...state,
                isLoading: false
            }

        case CustomerConstants.GET_CUSTOMER_GROUPS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case CustomerConstants.GET_LOCATIONS_REQUEST:
            return {
                ...state,
                location: {
                    ...state.location,
                    isLoading: true
                }
            }

        case CustomerConstants.GET_LOCATIONS_FAILE:
            return {
                ...state,
                location: {
                    ...state.location,
                    isLoading: false
                }
            }

        case CustomerConstants.GET_LOCATIONS_SUCCESS:
            return {
                ...state,
                location: {
                    ...state.location,
                    list: action.payload,
                    isLoading: false
                }
            }

        default:
            return state;
    }
}