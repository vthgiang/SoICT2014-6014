import { DiscountConstants } from './constants';

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
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 0,
    nextPage: 0,
    listDiscounts: [],
}

export function discounts(state = initState, action) { 
    let index = -1;
    switch (action.type) {
        case DiscountConstants.CREATE_DISCOUNT_REQUEST:
        case DiscountConstants.GET_ALL_DISCOUNTS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        
        case DiscountConstants.CREATE_DISCOUNT_FAILURE:
        case DiscountConstants.GET_ALL_DISCOUNTS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        
        case DiscountConstants.GET_ALL_DISCOUNTS_SUCCESS: 
            console.log("REDUCER", action.payload);
            return {
                ...state,
                isLoading: false,
                listDiscounts: action.payload.allDiscounts.docs,
                totalDocs: action.payload.allDiscounts.totalDocs,
                limit: action.payload.allDiscounts.limit,
                totalPages: action.payload.allDiscounts.totalPages,
                page: action.payload.allDiscounts.page,
                pagingCounter: action.payload.allDiscounts.pagingCounter,
                hasPrevPage: action.payload.allDiscounts.hasPrevPage,
                hasNextPage: action.payload.allDiscounts.hasNextPage,
                prevPage: action.payload.allDiscounts.prevPage,
                nextPage: action.payload.allDiscounts.nextPage
            }
        
        case DiscountConstants.CREATE_DISCOUNT_SUCCESS:
            return {
                ...state,
                listDiscounts: [
                    ...state.listDiscounts,
                    action.payload.discount
                ],
                isLoading: false
            }
        default:
            return state
    }
}